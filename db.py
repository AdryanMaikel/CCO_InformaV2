import sqlite3 as db


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
 

users = {
    "get": [row[0] for row in execute("SELECT name FROM operators")],
    "insert": "",
    "delete": "",
    "check_password": lambda user, _pass: check_password(user, _pass)
}

# Criando tabela de usuários

execute("""\
CREATE TABLE IF NOT EXISTS operators (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    cracha TEXT NOT NULL,
    password TEXT NOT NULL,
    logged INTEGER DEFAULT 0
);""")
