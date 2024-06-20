import sqlite3 as db


QUERY = {
    "insert": """\
INSERT INTO operators (name, cracha, password, logged) VALUES (?, ?, ?, ?)""",
    "delete": "DELETE FROM operators WHERE id = ?",
    "contains": """\
SELECT name FROM operators WHERE name = ? AND password = ?""",
    "get": "SELECT id, name, cracha, logged FROM operators",
    "update": lambda col: f"UPDATE operators SET {col} WHERE id = ?"
}


def execute(query: str, params: tuple = (), commit: bool = True):
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


def insert_operator(name: str, cracha: str, password: str, logged: int = 0):
    try:
        execute(QUERY["insert"], params=(name, cracha, password, logged))
    except Exception as ERROR:
        print(ERROR)


def remove_operator(_id: int):
    try:
        execute(QUERY["delete"], params=(_id,))
    except Exception as ERROR:
        print(ERROR)


def reset_password(_id: int, new_password: str):
    try:
        execute(QUERY["update"]("password = ?"), params=(new_password, _id))
    except Exception as ERROR:
        print(ERROR)


def contains_operator(name: str, password: str) -> bool:
    try:
        ROWS = execute(QUERY["contains"], params=(name, password),
                       commit=False)
        return True if ROWS else False
    except Exception as ERROR:
        print(ERROR)
        return False


def get_operators() -> dict[str, str | bool]:
    try:
        ROWS = execute(QUERY["get"], commit=False)
        return [{"id": row[0], "name": row[1], "cracha": row[2],
                 "logged": True if row[3] == 1 else False} for row in ROWS]
    except Exception as ERROR:
        print(ERROR)
        return {"erro": ERROR}


def update_status(name: str, online: bool):
    _id = 0
    operators = get_operators()
    for operator in operators:
        if operator["name"] == name:
            _id = operator["id"]
            break    
    if _id == 0:
        raise("Nome não encontrado")
    try:
        execute(QUERY["update"]("logged =  ?"), params=(online, _id))
    except Exception as ERROR:
        print(ERROR)


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
        "add": """INSERT INTO operators (name, cracha, password, logged) VALUES \
(?, ?, ?, ?)""",
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
    print(get_operators())
