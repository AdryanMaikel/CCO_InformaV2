from db import execute

create_table_notes = """\
CREATE TABLE IF NOT EXISTS notes(
    operator TEXT PRIMARY KEY,
    note TEXT
);"""

class Notes:
    def __init__(self):
        execute(create_table_notes)

    def get(self, operator: str) -> str:
        try:
            note = execute("SELECT note FROM notes WHERE operator = ?",    
                           params=(operator,), commit=False)
            if note:
                return note[0]
            execute(query="INSERT INTO notes (operator, note) VALUES (?, ?)",
                    params=(operator, ""))
            return ""
            
        except Exception as e:
            print(e)
            return "Falha ao obter nota.", 500

    def set(self, operator: str, note: str) -> bool:
        try:
            execute(query="UPDATE notes SET note = ? WHERE operator = ?",
                    params=(note, operator))
            return True
        except Exception as e:
            print(e)
            return False


notes = Notes()

if __name__ == "__main__":
    print(notes.get("Adryan"))


