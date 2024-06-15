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
    rows = execute("SELECT name FROM operators WHERE name = ? AND id = ?",
                   params=(name, cracha), commit=False)
    return True if rows else False


# insert_operator("Adryan")
set_number("Adryan", 155)
print(contains_operator("Adryan", 0))
# remove_operator("Adryan")
# print(contains_operator("Adryan"))
