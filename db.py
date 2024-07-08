import sqlite3 as db
from datetime import datetime as dt


def execute(query: str, params: tuple = (), commit: bool = True) -> list:
    try:
        conn = db.connect("database.db")
        cursor = conn.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()
        if commit:
            conn.commit()
        cursor.close()
        conn.close()
        if rows:
            return rows
        return []
    except Exception as erro:
        print(erro)
        return []


def check_password(user: str, password: str):
    if execute("SELECT name FROM operators WHERE name = ? AND password = ?",
               params=(user, password)):
        return True
    return False


def delete_operator(name: str, password: str):
    execute("DELETE FROM operators WHERE name = ? AND password = ?",
            (name, password))


def get_messages():
    query = "SELECT id, name, date, message FROM messages WHERE visibled = 1"
    return [{"id": row[0],
             "name": row[1],
             "date": "/".join(reversed(str(row[2]).split()[0].split("-"))),
             "hour": str(row[2]).split()[1].split(".")[0],
             "message": row[3]
             } for row in execute(query, commit=False)],


operators = {
    "get": lambda: [row[0] for row in execute("SELECT name FROM operators",
                                              commit=False)],
    "insert": lambda name, password, cracha = "": execute(
        "INSERT INTO operators (name, password, cracha) VALUES (?, ?, ?)",
        params=(name, password, cracha)
    ),
    "delete": lambda name, password: delete_operator(name, password),
    "check_password": lambda user, _pass: check_password(user, _pass)
}

messages = {
    "get": lambda: get_messages()[0],
    "insert": lambda name, message: execute(
        "INSERT INTO messages (name, date, message) VALUES (?, ?, ?)",
        params=(name, dt.now(), message)
    ),
    "delete": lambda id: execute(
        "UPDATE messages SET visibled = 0 WHERE id = ?", (id,)
    )
}

# Criando tabela de usuários e mensagens

execute("""\
CREATE TABLE IF NOT EXISTS operators (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    cracha TEXT NOT NULL,
    password TEXT NOT NULL,
    logged INTEGER DEFAULT 0
);""")

execute("""\
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    date TIMESTAMP NOT NULL,
    message TEXT NOT NULL,
    visibled INTEGER DEFAULT 1
);""")

# testes
# operators["insert"]("Nicole", "nic", 1)

print(operators["get"]())
# execute("DELETE FROM messages")

if __name__ == "__main__":
    # print(execute("SELECT * FROM messages"))
    # print(execute("SELECT * FROM operators"))
    # operators["insert"]("Adryan", "151", "151")
    # print(execute("select * from operators", commit=False))
    #     messages["insert"]("Adryan", "Olá!")
    #     messages["insert"]("Nicole", "Oi.")
    #     messages["insert"]("Adryan", """\
    # def calcular_pagamento(qtd_horas, valor_hora):
    #     horas = float(qtd_horas)
    #     taxa = float(valor_hora)
    #     if horas <= 40:
    #         salario=horas*taxa
    #     else:
    #         h_excd = horas - 40
    #         salario = 40*taxa+(h_excd*(1.5*taxa))
    #     return salario
    # """)
    # messages["delete"](1)
    print(messages["get"]())
    pass
