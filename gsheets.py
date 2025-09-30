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
        # sheet de testes
        # sheet_key = "101ykzDT_qWUN_CzQ4uVyR25hTe6KERvVVOkzSGtbDNk"
        # sheet_key = "1HE-YSckUzAx1sxERFpBZLVRGIxWzeEfOeB61n-zM4dU"

        # sheet de produção
        sheet_key = "1voKCp0MJOelI0-qv9s_m3VF5GUvkS4lbKyArA6NbmTs"
        self.ws = gsheets.open_by_key(sheet_key).worksheet(title)
        self.letters: list[str] = "ABCDEFGHIJKL"
        self.columns: list[str] = self.ws.row_values(1)
        self.last_row = self.ws.row_count

    def get_rows(self, dates: list[str] = []) -> list:
        try:
            values = self.ws.get_values("A2:L")
        except Exception as error:
            print(error)
            return []
        rows = [[i, *row]for i, row in enumerate(values, 2)]
        if dates:
            rows = list(filter(lambda row: row[1] in dates, rows))
        return rows

    def add_row(self, row: int, values: dict[str, str] = {}) -> bool:
        values_to_insert = [values.get(letter, "")for letter in self.letters]
        range_from, range_to = f"A{row+1}:L{row+1}", f"A{row}:L{row}"
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
    
    def _col_letter_to_index(self, letter: str) -> int:
        return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".index(letter) + 1  # A=1, B=2...

    def get_rows_by_date(self,
                         date_str: str,
                         date_col: str = "A"
                         ) -> list[list]:
        try:
            values = self.ws.get_values("A2:L")
        except Exception as error:
            print(error)
            return []
        rows = [[i, *row] for i, row in enumerate(values, 2)]
        date_idx = self._col_letter_to_index(date_col)
        return [r for r in rows
                if len(r) > date_idx and r[date_idx] == date_str]

    def has_duplicate_same_day(
        self,
        values: dict[str, str],
        date_str: str,
        compare_cols: tuple[str, ...] = ("A", "D", "F", "G"),
        date_col: str = "A",
    ) -> bool:
        existing = self.get_rows_by_date(date_str, date_col=date_col)
        idxs = [self._col_letter_to_index(c) for c in compare_cols]
        seen = set()
        for r in existing:
            key = tuple((r[i].strip().lower()
                         if len(r) > i and isinstance(r[i], str)
                         else r[i]) for i in idxs)
            seen.add(key)
        new_key = tuple((values.get(c, "") or "").strip().lower()
                        for c in compare_cols)
        return new_key in seen


gsheet = Sheet("Histórico de eventos 2.0")

if __name__ == "__main__":
    rows = gsheet.get_rows(dates=["17/08/2025", "18/08/2025"])
    print(rows)
