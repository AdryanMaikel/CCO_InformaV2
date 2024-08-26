from db import execute

create_table_message = """\
CREATE TABLE IF NOT EXISTS informations (
    id INTEGER PRIMARY KEY,
    operator TEXT NOT NULL,
    cco_informa TEXT NOT NULL,
    json TEXT NOT NULL
);"""


class Informations():
    def __init__(self):
        execute(create_table_message)

    def get(self, _operator) -> list[dict[str, str]]:
        return list([{
            "id": _id,
            "operator": operator,
            "cco_informa": cco_informa,
            "json": json
        }for _id, operator, cco_informa, json in execute(
            query="SELECT*FROM informations", commit=False
        )if operator == _operator])

    def insert(self, operator, cco_informa, json):
        execute("""\
INSERT INTO informations (operator, cco_informa, json) VALUES (?, ?, ?)""",
                params=(operator, cco_informa, json)),
        ids = execute("SELECT id FROM informations WHERE operator = ?",
                      params=(operator,), commit=False)
        return str(ids[-1]) if ids else ""

    def delete(self, id):
        execute("DELETE FROM informations WHERE id = ?", (id,))
        return "Sucesso!"


informations = Informations()

if __name__ == "__main__":
    # informations = Informations()
    print(informations.get("Adryan"))
