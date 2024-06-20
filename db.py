import sqlite3 as db


def execute(query: str, params: tuple, commit: bool = True):
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


def insert_operator(name):
    try:
        execute(query="INSERT INTO operators (name, id) VALUES (?, ?)",
                params=(name, 0))
    except Exception as ERROR:
        print(ERROR)


def remove_operator(name: str):
    try:
        execute(query="DELETE FROM operators WHERE name = ?",
                params=(name,))
    except Exception as ERROR:
        print(ERROR)


def set_number(name: str, cracha: int):
    try:
        execute("UPDATE operators SET id = ? WHERE name = ?", (cracha, name))
    except Exception as ERROR:
        print(ERROR)


def contains_operator(name: str, cracha: int) -> bool:
    try:
        ROWS = execute("SELECT name FROM operators WHERE name = ? AND id = ?",
                       params=(name, cracha), commit=False)
        return True if ROWS else False
    except Exception as ERROR:
        print(ERROR)
        return False


if __name__ == "__main__":
    querys = {
        "create": """\
CREATE TABLE IF NOT EXISTS operators (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    cracha TEXT NOT NULL,
    password TEXT NOT NULL
);""",
        "alter table": """\
ALTER TABLE operators ADD COLUMN logged INTEGER DEFAULT 0""",
        "drop": "DROP TABLE operators",
        "select": lambda cols: f"SELECT {''.join(cols)} FROM operators",
        "add": """INSERT INTO operators (name, cracha, password) VALUES \
(?, ?, ?)""",
        "delete": "DELETE FROM operators WHERE id = ?",
        "update": lambda cols: f"UPDATE operators SET {cols} where id = ?"
    }

    # execute(querys["alter table"], params=())
    # execute(querys["update"]("logged =  ?"), ((False, 1)))
    # execute(querys["add"], params=("Adryan", "155", "PintoDuro"))
    # execute(querys["delete"], params=(1,))

    print(execute(querys["select"]("id, name, cracha, logged"), (), False))


"""\
CREATE OR REPLACE TABLE IF EXISTS operators (id, name, cracha, password)
"""


# insert_operator("Adryan")
# set_number("Adryan", 155)
# print(contains_operator("Adryan", "155"))
# remove_operator("Adryan")
