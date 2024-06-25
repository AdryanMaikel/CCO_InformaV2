import sqlite3 as db
from datetime import datetime as dt


QUERY = {
    "insert": """\
INSERT INTO operators (name, cracha, password, logged) VALUES (?, ?, ?, ?)\
""",
    "delete": """\
DELETE FROM operators WHERE id = ?\
""",
    "contains": """\
SELECT name FROM operators WHERE name = ? AND password = ?\
""",
    "get": """\
SELECT id, name, cracha, logged FROM operators\
""",
    "update": lambda col: f"""\
UPDATE operators SET {col} WHERE id = ?\
"""
}

QUERYS_MESSAGENS = {
    "create": """\
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    visibled INTEGER DEFAULT 1
);""",
    "insert": """\
INSERT INTO messages (name, date, message) VALUES (?, ?, ?)\
""",
    "get": """\
SELECT * FROM messages WHERE visibled = 1\
""",
    "delete": """\
UPDATE messages SET visibled = 1 WHERE id = ?\
"""
}


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


def insert_operator(name: str, cracha: str, password: str, logged: int = 0):
    execute(QUERY["insert"], params=(name, cracha, password, logged))


def remove_operator(_id: int):
    execute(QUERY["delete"], params=(_id,))


def reset_password(_id: int, new_password: str):
    execute(QUERY["update"]("password = ?"), params=(new_password, _id))


def contains_operator(name: str, password: str) -> bool:
    ROWS = execute(QUERY["contains"], params=(name, password),
                   commit=False)
    return True if ROWS else False


def get_operators() -> list[dict[str, str | bool]]:
    ROWS = execute(QUERY["get"], commit=False)
    return [{"id": row[0], "name": row[1], "cracha": row[2],
             "logged": True if row[3] == 1 else False} for row in ROWS]


def update_status(name: str, online: bool):
    _id = 0
    for operator in get_operators():
        if operator.get("name", "") == name:
            _id = operator.get("id", 0)
            break
    if _id == 0:
        raise Exception("Nome não encontrado")
    execute(QUERY["update"]("logged =  ?"), params=(online, _id))


def get_messages() -> list[dict[str, int | str]]:
    rows = execute(QUERYS_MESSAGENS["get"])
    return [{"id": row[0], "date": row[1], "name": row[2],
             "message": row[3]}for row in rows]


def post_message(name: str, message: str):
    for operator in get_operators():
        if name == operator.get("name", ""):
            execute(QUERYS_MESSAGENS["insert"], (name, dt.now(), message))


def hidden_message(_id: int, name: str):
    for operator in get_operators():
        if name == operator.get("name", ""):
            execute(QUERYS_MESSAGENS["delete"], params=(_id,))


messages = {
    "get": lambda: get_messages(),
    "post": lambda name, message: post_message(name, message),
    "hidden": lambda _id, name: hidden_message(_id, name)
}

if __name__ == "__main__":
    querys = {
        "create": """\
CREATE TABLE IF NOT EXISTS operators (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    cracha TEXT NOT NULL,
    password TEXT NOT NULL,
    logged INTEGER DEFAULT 0
);""",
        "alter table": """\
ALTER TABLE operators ADD COLUMN logged INTEGER DEFAULT 0""",
        "drop": "DROP TABLE operators",
        "select": lambda cols: f"SELECT {''.join(cols)} FROM operators",
        "add": """INSERT INTO operators (name, cracha, password, logged) \
VALUES (?, ?, ?, ?)""",
        "delete": "DELETE FROM operators WHERE id = ?",
        "update": lambda cols: f"UPDATE operators SET {cols} where id = ?"
    }
    # execute(querys["create"], params=())
    # execute(querys["alter table"], params=())
    # execute(querys["add"], params=("Adryan", "155", "PintoDuro", False))
    # execute(querys["update"]("logged =  ?"), ((False, 1)))
    # execute(querys["delete"], params=(1,))
    # print(execute(querys["select"]("id, name, cracha, logged"), (), False))

    # print(contains_operator("Adryan", "PintoDuro"))
    # update_status("dryan", False)
    # execute(querys.get("update")("password = ?"), ("155", 1))

    # print(get_operators())
    # print(contains_operator("Adryan", "155"))

    # execute(QUERYS_MESSAGENS["create"])
    # execute(QUERYS_MESSAGENS["insert"], ("Adryan", dt.now(), "Oi!"))
    # rows = execute(QUERYS_MESSAGENS["get"])
    # messages = [{"id": row[0], "date": row[1], "name": row[2],
    #              "message": row[3]}for row in rows]
    # print(messages)
    # post_message("Adryan", "Oi2.")
    hidden_message(1, "Adryan")
    # messages = get_messages()
    print(execute("select * from messages"))
    # print(messages)
