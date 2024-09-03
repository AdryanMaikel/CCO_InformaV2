from gspread import authorize
from google.oauth2.service_account import Credentials

gsheets = authorize(
    Credentials.from_service_account_file(
        "credentials.json",
        scopes=["https://www.googleapis.com/auth/spreadsheets"]
    )
)


class Sheet:
    def __init__(self, title: str):
        sheet_key = "101ykzDT_qWUN_CzQ4uVyR25hTe6KERvVVOkzSGtbDNk"
        # sheet_key = "1HE-YSckUzAx1sxERFpBZLVRGIxWzeEfOeB61n-zM4dU"
        self.ws = gsheets.open_by_key(sheet_key).worksheet(title)
        self.letters: list[str] = "ABCDEFGHIJK"
        self.columns: list[str] = self.ws.row_values(1)
        self.last_row = self.ws.row_count

    def get_rows(self, dates: list[str] = []) -> list:
        try:
            values = self.ws.get_values("A2:K")
        except Exception as error:
            print(error)
            return []
        rows = [[i, *row]for i, row in enumerate(values, 2)]
        if dates:
            rows = list(filter(lambda row: row[1] in dates, rows))
        return rows

    def add_row(self, row: int, values: dict[str, str] = {}) -> bool:
        values_to_insert = [values.get(letter, "")for letter in self.letters]
        range_from, range_to = f"A{row+1}:K{row+1}", f"A{row}:K{row}"
        try:
            self.ws.insert_row(values_to_insert, row)
            for type_paste in ["PASTE_DATA_VALIDATION", "PASTE_FORMAT"]:
                self.ws.copy_range(range_from, range_to, type_paste)
            return True
        except Exception as error:
            print(f"Erro ao adicionar linha {row} com os valores\n"
                  f"{values_to_insert}\nErro:{error}")
            return False

    def delete_row(self, row: int) -> bool:
        try:
            self.ws.delete_rows(row)
            return True
        except Exception as error:
            print(f"Erro ao excluir linha {row}. Erro: {error}")
            return False

    def update_row(self, row: int, values: dict[str, str]) -> bool:
        try:
            self.ws.batch_update([{"range": cell, "values": [[value]]}
                                  for cell, value in values.items()])
            return True
        except Exception as error:
            print(f"Erro ao atualizar a linha {row} com os valores {values}\n"
                  f"Erro: {error}")
            return False


gsheet = Sheet("Histórico de eventos")

if __name__ == "__main__":
    rows = gsheet.get_rows(dates=["27/08/2024", "26/08/2024"])
    print(rows)
