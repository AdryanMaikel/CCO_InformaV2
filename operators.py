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
        if name in self.get().keys():
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
        password_is_valid = execute(
            "SELECT name FROM operators WHERE name = ? AND password = ?",
            params=(name, password), commit=False
        )
        if password_is_valid:
            return True
        execute("""\
UPDATE operators SET tentatives = tentatives - 1 WHERE name = ? \
AND tentatives > 0""", params=(name,))
        return False

    def get_all(self):
        rows = execute(
            query="SELECT id, name, logged, tentatives FROM operators",
            commit=False
        )
        return [{
            "id": id,
            "name": name,
            "logged": bool(logged),
            "tentatives": tentatives
        } for id, name, logged, tentatives in rows if name != "Adryan"]

    def delete_by_name(self, name: str) -> str:
        """Deletar operador apenas pelo nome (para uso administrativo)"""
        if name not in self.get():
            return f"{name} não encontrado."

        execute(
            "DELETE FROM operators WHERE name = ?",
            params=(name,)
        )
        return f"{name} deletado com sucesso!"

    def update_tentatives(self, name: str) -> str:
        if not name.isalnum() or name not in self.get().keys():
            return "Nome inválido."
        execute(
            "UPDATE operators SET tentatives = 5 WHERE name = ?",
            params=(name,)
        )
        return "Tentativas resetadas!"

    def change_password(self, name: str, new_password: str) -> str:
        """Alterar senha do operador"""
        if not name.isalnum() or not new_password.isalnum():
            return "Nome ou senhas inválidos."

        execute(
            "UPDATE operators SET password = ?, tentatives = 5 WHERE name = ?",
            params=(new_password, name)
        )
        return f"Senha de {name} alterada com sucesso!"


operators = Operators()

if __name__ == "__main__":
    op = Operators()
    print(op.get_all())
