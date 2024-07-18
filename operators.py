from db import execute

create_table_operators = """\
CREATE TABLE IF NOT EXISTS operators (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    cracha TEXT NOT NULL,
    password TEXT NOT NULL,
    logged INTEGER DEFAULT 0,
    tentatives INTEGER DEFAULT 5
);"""


class Operators:
    def __init__(self):
        execute(create_table_operators)

    def get(self) -> dict[str, bool]:
        return {operator: bool(online) for operator, online in dict(execute(
            "SELECT name, logged FROM operators WHERE tentatives > 0",
            commit=False
        )).items()}

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


if __name__ == "__main__":
    operators = Operators()
    # operators.insert("Janilse", "1004840601")
    print(operators.get())
