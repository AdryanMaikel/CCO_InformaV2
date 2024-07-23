from google.oauth2.service_account import Credentials
from gspread import authorize

# from datetime import datetime as dt


gsheets = authorize(Credentials.from_service_account_file(
    "credentials.json", scopes=["https://www.googleapis.com/auth/spreadsheets"]
))

# SS = gsheets.open_by_key("101ykzDT_qWUN_CzQ4uVyR25hTe6KERvVVOkzSGtbDNk")
# WS_DADOS = SS.worksheet("Dados")
# WS_CCO_INFORMA = SS.worksheet("Histórico de eventos")


# def add_last_row(col: str) -> int:
#     last_row = len(WS_DADOS.col_values("_ABCDE".index(col))) + 1
#     if last_row > WS_DADOS.row_count:
#         WS_DADOS.add_rows(1)
#     return last_row


class Sheet:
    def __init__(self):
        sheet_key = "101ykzDT_qWUN_CzQ4uVyR25hTe6KERvVVOkzSGtbDNk"
        title = "Histórico de eventos"
        self.ww = gsheets.open_by_key(sheet_key).worksheet(title)
        self.letters: list[str] = "ABCDEFGHIJK"
        self.columns: list[str] = self.ww.row_values(1)
        self.last_row = self.ww.row_count

    def get_rows(self, dates: list[str] = []) -> list:
        try:
            values = self.ww.get_values("A2:K")
        except Exception as error:
            print(error)
            return []
        rows = [[i, *row]for i, row in enumerate(values, 2)]
        if dates:
            rows = [row for row in rows if row[1] in dates]
        return rows

    def add_row(self, row: int, values: dict[str, str] = {}) -> bool:
        print(values)
        values_to_insert = [values.get(letter, "")for letter in self.letters]
        range_from, range_to = f"A{row+1}:K{row+1}", f"A{row}:K{row}"
        try:
            self.ww.insert_row(values_to_insert, row)
            for type_paste in ["PASTE_DATA_VALIDATION", "PASTE_FORMAT"]:
                self.ww.copy_range(range_from, range_to, type_paste)
            return True
        except Exception as error:
            print(f"Erro ao adicionar linha {row} com os valores\n"
                  f"{values_to_insert}\nErro:{error}")
            return False

    def delete_row(self, row: int) -> bool:
        try:
            self.ww.delete_rows(row)
            return True
        except Exception as error:
            print(f"Erro ao excluir linha {row}. Erro: {error}")
            return False

    def update_row(self, row: int, values:  dict[str, str]) -> bool:
        try:
            self.ww.batch_update([{"range": column, "values": [[value]]}
                                  for column, value in values.items()])
            return True
        except Exception as error:
            print(f"Erro ao atualizar a linha {row} com os valores {values}\n"
                  f"Erro: {error}")


if __name__ == "__main__":
    sheet = Sheet()
    # sheet.add_row(2)
    # sheet.update_row(2, {"A": dt.now().strftime("%d/%m/%Y")})
    # print(sheet.last_row)
    rows = sheet.get_rows()
    print(rows[83])
    # print(sheet.letters)
    # sheet.delete_row(2)

    # print(sheet.columns)
    # print(INFORMATIONS["problemas"]["get"]())
    # print(WS_DADOS.get_values("B2:B"))
    # data = INFORMATIONS["cco-informa"]["cols"]()
    # for i in range(len(INFORMATIONS["cco-informa"]["cols"]())):
    #     print(i)
    # print(INFORMATIONS["cco-informa"]["get"]())

    # values = sheet.get(dates=["17/04/2024"])
    # print(len(values))
    pass
