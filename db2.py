import sqlite3 as sql
# from datetime import datetime as dt


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
        return execute("SELECT name FROM operators WHERE tentatives > 0",
                       commit=False)

    def insert(self, name: str, password: str, cracha: str = "") -> str:
        if name in self.get():
            return f"{name} já incluso."
        execute("INSERT INTO operators(name, password, cracha)VALUES(?, ?, ?)",
                params=(name, password, cracha))
        return f"{name}, nserido com sucesso!"

    def delete(self, name: str, password: str) -> str:
        execute("DELETE FROM operators WHERE name = ? AND password = ?",
                params=(name, password))
        return f"{name}, deletado com sucesso!"

    def toggle_online(self, name: str, password: str, online: bool) -> str:
        execute(
            "UPDATE operators SET logged = ? WHERE name = ? AND password = ?",
            params=(online, name, password))


# operators = Operators()
# print(operators.get())
# operators.delete("Maikel", "151")
# print(operators.get())
# operators.insert("Maikel", "151", "000")
# operators.insert("Maikel", "151", "000")
# print(operators.get())

# print(execute("SELECT id FROM operators Where id = 1", commit=False))
# print(execute("SELECT * FROM operators", commit=False))
