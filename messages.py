from db import execute

from collections import defaultdict
from datetime import datetime as dt, timedelta as td

create_table_messages = """\
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    date TIMESTAMP NOT NULL,
    message TEXT NOT NULL,
    visibled INTEGER DEFAULT 1
);"""


class Messages:
    def __init__(self):
        execute(create_table_messages)

    def get(self) -> list[dict[str, str | list[dict[str, str | int]]]]:
        messages = list([{
            "id": _id,
            "name": name,
            "date": "/".join(reversed(str(date).split()[0].split("-"))),
            "hour": str(date).split()[1].split(".")[0],
            "message": message
        }for _id, name, date, message in execute(
            "SELECT id, name, date, message FROM messages WHERE visibled = 1",
            commit=False
        )])
        grouped_messages = defaultdict(list)
        for message in messages:
            grouped_messages[message["date"]].append(message)
        return [{"date": date, "messages": message}
                for date, message in grouped_messages.items()]

    def insert(self, name: str, message: str):
        if message.count("\n") > 15:
            return f"{message} enorme de {name}."
        execute("INSERT INTO messages (name, date, message) VALUES (?, ?, ?)",
                params=(name, dt.now() - td(hours=3), message))
        return f"Sucesso, mensagem:\n\n{message}\nde {name} inserida."

    def hidden(self, _id: int) -> bool:
        if _id not in execute("SELECT id FROM messages", commit=False):
            print(f"Mensagem com id: {_id}, não inclusa.")
            return False
        execute("UPDATE messages SET visibled = 0 WHERE id = ?", (_id,))
        print(f"Mensagem com id: {_id}, oculta.")
        return True

    def show(self, _id: int) -> bool:
        if _id not in execute("SELECT id FROM messages", commit=False):
            print(f"Mensagem com id: {_id}, não inclusa.")
            return False
        execute("UPDATE messages SET visibled = 1 WHERE id = ?", (_id,))
        print(f"Mensagem com id: {_id}, habilitada.")
        return True

    def remove(self, _id: int) -> bool:
        if _id not in execute("SELECT id FROM messages", commit=False):
            print(f"Mensagem com id: {_id}, não inclusa.")
            return False
        execute("DELETE FROM messages WHERE id = ?", (_id,))
        print(f"Mensagem com id: {_id}, removida.")
        return True


if __name__ == "__main__":
    messages = Messages()
    print(messages.get())
