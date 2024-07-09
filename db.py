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
    except db.Error as erro:
        print(erro)
        return []


def check_password(name, password) -> bool:
    if execute("SELECT name FROM operators WHERE name = ? AND password = ?",
               params=(name, password), commit=False):
        return True
    execute("UPDATE operators SET tentatives = tentatives - 1 WHERE name = ?",
            params=(name,))
    return False


operators = {
    "get": lambda: [name for _, name in execute(
        "SELECT id, name FROM operators WHERE tentatives > 0", commit=False
    )],
    "insert": lambda name, password, cracha = "": execute(
        "INSERT INTO operators (name, password, cracha) VALUES (?, ?, ?)",
        params=(name, password, cracha)
    ) if name not in list(operators["get"]()) else None,
    "delete": lambda name, password: execute(
        "DELETE FROM operators WHERE name = ? AND password = ?",
        params=(name, password)
    ),
    "check_password": lambda name, password: check_password(name, password),
    "update status": lambda name, password, status: execute(
        "UPDATE operators SET logged = ? WHERE name = ? AND password = ?",
        params=(bool(status), name, password))
}

messages = {
    "get": lambda: list([{
        "id": row[0],
        "name": row[1],
        "date": "/".join(reversed(str(row[2]).split()[0].split("-"))),
        "hour": str(row[2]).split()[1].split(".")[0],
        "message": row[3]
    }for row in execute(
        "SELECT id, name, date, message FROM messages WHERE visibled = 1",
        commit=False
    )]),
    "insert": lambda name, message: execute(
        "INSERT INTO messages (name, date, message) VALUES (?, ?, ?)",
        params=(name, dt.now(), message)
    ),
    "delete": lambda id: execute(
        "UPDATE messages SET visibled = 0 WHERE id = ?", (id, )
    )
}

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

if __name__ == "__main__":
    query = "Select * from operators"
    # query = "update operators set tentatives = 5 where name = 'Adryan'"
    params = ()
    commit = True
    # execute("DELETE FROM OPERATORS WHERE NAME = ? AND PASSWORD = ?", ("Maikel", "101"))
    # print(operators["insert"]("Maikel", "151"))
    # print(operators["check_password"]("Adryan", "101"))
    print(operators["get"]())
    print(execute(query, params, commit))
    # print(operators["delete"]("Maikel", "10"))
    # rows = execute(query="SELECT * FROM operators WHERE logged = true")
    # print(rows)
    # print(messages["get"]())
    pass
