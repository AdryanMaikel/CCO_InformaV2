from db import execute

create_table_message = """\
CREATE TABLE IF NOT EXISTS informations (
    id INTEGER PRIMARY KEY,
    operator TEXT NOT NULL,
    information TEXT NOT NULL
);"""


class Informations():
    def __init__(self):
        execute(create_table_message)

    def get(self) -> list:
        informations = list([{
            "id": _id,
            "operator": operator,
            "information": information
        }for _id, operator, information in execute(
            query="SELECT*FROM informations", commit=False
        )])
        return informations

    def insert(self, operator, information):
        if not str(operator).isalpha():
            return "Falha ao criar cco informa."
        execute(
            "INSERT INTO informations (operator, information) VALUES (?, ?)",
            params=(operator, information)
        ),
        ids = execute("SELECT id FROM informations ORDER BY id DESC")
        id = ""
        if ids:
            id = ids[0]
            return f"CCO Informa criado {id}."
        return "Falha."

    def delete(self, id):
        if str(id).isnumeric():
            execute("DELETE FROM informations WHERE id = ?", (id))
            return f"CCO Informa excluido id: {id}"
        return f"Falha ao remover cco informa id {id}"


if __name__ == "__main__":
    informations = Informations()
    informations.insert("Adryan", "oi")
    print(informations.get())
