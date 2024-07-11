import sqlite3 as sql
from datetime import datetime as dt

from collections import defaultdict


def execute(query: str, params: tuple = (), commit: bool = True) -> list:
    """Executa uma consulta SQL com os parâmetros fornecidos.

    :param query: Consulta SQL a ser executada.
    :param params: Parâmetros a serem usados na consulta.
    :param commit: Se True, realiza o commit da transação.
    :return: Lista de resultados da consulta.
    """
    try:
        with sql.connect("database.db") as connection:
            cursor = connection.cursor()
            cursor.execute(query, params)
            if commit:
                connection.commit()
                return []
            rows = cursor.fetchall()
            return [row if len(row) > 1 else row[0] for row in rows]
    except sql.Error as erro:
        print(erro)
        return []


class Operators:
    def __init__(self):
        pass

    def get(self) -> list:
        return execute(
            "SELECT name FROM operators WHERE tentatives > 0",
            commit=False
        )

    def insert(self, name: str, password: str, cracha: str = "") -> str:
        if name in self.get():
            return f"{name} já incluso."
        if not name.isalnum() or not password.isalnum():
            return f"{name} ou {password} invalidos."
        execute(
            "INSERT INTO operators (name, password, cracha) VALUES (?, ?, ?)",
            params=(name, password, cracha)
        )
        return f"{name}, inserido com sucesso!"

    def delete(self, name: str, password: str) -> str:
        execute(
            "DELETE FROM operators WHERE name = ? AND password = ?",
            params=(name, password)
        )
        return f"{name}, deletado com sucesso!"

    def toggle_online(self, name: str, password: str, online: bool) -> str:
        execute(
            "UPDATE operators SET logged = ? WHERE name = ? AND password = ?",
            params=(online, name, password)
        )
        return f"{name} está agora {'online' if online else 'offline'}."

    def check_password(self, name: str, password: str):
        if not name.isalnum() or not password.isalnum():
            return False
        contains_operator = execute(
            "SELECT name FROM operators WHERE name = ? AND password = ?",
            params=(name, password), commit=False
        )
        if contains_operator:
            return True
        execute("""\
UPDATE operators SET tentatives = tentatives - 1 WHERE name = ? \
AND tentatives > 0""", params=(name,))
        return False


class Messages:
    def __init__(self):
        pass

    def get(self) -> list[dict[str, str | list[dict[str, str | int]]]]:
        messages = list([{
            "id": row[0],
            "name": row[1],
            "date": "/".join(reversed(str(row[2]).split()[0].split("-"))),
            "hour": str(row[2]).split()[1].split(".")[0],
            "message": row[3]
        }for row in execute(
            "SELECT id, name, date, message FROM messages WHERE visibled = 1",
            commit=False
        )])

        grouped_messages = defaultdict(list)
        for message in messages:
            grouped_messages[message["date"]].append(message)

        return [{"date": date, "messages": message}
                for date, message in grouped_messages.items()]

    def insert(self, name: str, message: str):
        execute("INSERT INTO messages (name, date, message) VALUES (?, ?, ?)",
                params=(name, dt.now(), message))


# Criando tabela de usuários e mensagens
execute("""\
CREATE TABLE IF NOT EXISTS operators (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    cracha TEXT NOT NULL,
    password TEXT NOT NULL,
    logged INTEGER DEFAULT 0,
    tentatives INTEGER DEFAULT 5
);""")

execute("""\
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    date TIMESTAMP NOT NULL,
    message TEXT NOT NULL,
    visibled INTEGER DEFAULT 1
);""")

# operators = Operators()
# print(operators.get())
# print(operators.check_password("Adryan", "0"))
# operators.delete("Adryan", "151")
# print(operators.get())
# operators.insert("Adryan", "151", "")
# operators.insert("Maikel", "151", "000")
# print(operators.get())

# print(execute("SELECT id FROM operators Where id = 1", commit=False))
# print(execute("SELECT * FROM operators", commit=False))

# messages = Messages()
# print(messages.get())
