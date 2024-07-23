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
            "id": row[0],
            "name": row[1],
            "date": "/".join(reversed(str(row[2]).split()[0].split("-"))),
            "hour": str(row[2]).split()[1].split(".")[0],
            "message": row[3]
        }for row in execute(
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


if __name__ == "__main__":
    messages = Messages()
    print(messages.get())
