from google.oauth2.service_account import Credentials
from gspread import authorize

CLIENT = authorize(
    Credentials.from_service_account_file("credentials.json", scopes=[
        "https://www.googleapis.com/auth/spreadsheets"]))

SS = CLIENT.open_by_key("101ykzDT_qWUN_CzQ4uVyR25hTe6KERvVVOkzSGtbDNk")
WS_DADOS = SS.worksheet("Dados")
WS_CCO_INFORMA = SS.worksheet("Histórico de eventos")


def add_last_row(col: str) -> int:
    last_row = len(WS_DADOS.col_values("ABCDE".index(col) + 1)) + 1
    if last_row > WS_DADOS.row_count:
        WS_DADOS.add_rows(1)
    return last_row


def add_cell(direction: str, row: int, col: str, value: str | int | float):
    """Função que adiciona uma celula e atribui o valor.

    :direction: str - Direção a qual flutuara o resto dos valores.\
    Direções: "bottom" ou "top".
    :row: int - Número da linha da tabela. ex: 1
    :col: str - Letra da coluna. ex: "A"
    :value: str | int | float - Valor a ser inserido.

    >>> add_cell(direction="top", row=8, col="A", value=3)
    >>> add_cell(direction="bottom", row=3, col="E", value=3)
    """
    if direction == "bottom":
        row += 1
    WS_DADOS.cut_range(f"{col}{row}:{col}", f"{col}{row+1}:{col}")
    WS_DADOS.update_acell(f"{col}{row}", value)


def add_operator(direction, row, operator: str, cracha: str) -> None:
    """Função utilizada para adicionar um operador ou um cracha.

    :param operator: str - Operador a ser adicionado na ultima linha.
    :param cracha: str - Cracha a ser adicionado na ultima linha.
    """
    if operator and cracha and cracha.isnumeric():
        operator = operator.strip().title()
        cracha = int(cracha.strip())
        add_cell(direction=direction, row=row, col="D", value=operator)
        add_cell(direction=direction, row=row, col="E", value=cracha)


def update_operator(row: str, operator: str, cracha: str) -> None:
    if operator:
        operator = operator.strip().title()
        WS_DADOS.update_acell(f"D{row}", operator)

    if cracha and cracha.isnumeric():
        cracha = int(cracha.strip())
        WS_DADOS.update_acell(f"E{row}", cracha)


def update_row_cco_informa(row, values: dict[str, str | int]):
    for col, value in values.items():
        WS_CCO_INFORMA.update_acell(f"{col}{row}", value)


def add_row_cco_informa(direction, row, values):
    if direction == "bottom":
        row += 1

    WS_CCO_INFORMA.cut_range(f"A{row}:K", f"A{row+1}:K")
    WS_CCO_INFORMA.copy_range(f"A{row+1}:K{row+1}", f"A{row}:K{row}",
                              paste_type="PASTE_DATA_VALIDATION")
    WS_CCO_INFORMA.copy_range(f"A{row+1}:K{row+1}", f"A{row}:K{row}",
                              paste_type="PASTE_FORMAT")

    if not values:
        return
    update_row_cco_informa(row, values)


INFORMATIONS = {}
INTERVALS = [["ocorrencias", "A"], ["problemas", "B"], ["sentidos", "C"]]
for name, col in INTERVALS:
    INFORMATIONS[name] = {
        "get": lambda _=name, col=col:
            [row[0] for row in WS_DADOS.get_values(f"{col}2:{col}")],
        "add": lambda direction, row, value, col=col:
            add_cell(direction, row, col, value),
        "del": lambda row, col=col:
            WS_DADOS.cut_range(f"{col}{row+1}:{col}", f"{col}{row}:{col}"),
        "upd": lambda row, value, col=col:
            WS_DADOS.update_acell(f"{col}{row}", value)
    }

INFORMATIONS["operadores"] = {
    "get": lambda: WS_DADOS.get_values("D2:E"),
    "add": lambda direction, row, operator, cracha:
        add_operator(direction, row, operator, cracha),
    "del": lambda row:
        WS_DADOS.cut_range(f"D{row+1}:E", f"D{row}:E"),
    "upd": lambda row, operator, cracha: update_operator(row, operator, cracha)
}

INFORMATIONS["cco-informa"] = {
    "cols": lambda: WS_CCO_INFORMA.get_values("A1:K1")[0],
    "letters": lambda: "A B C D E F G H I J K".split(),
    "get": lambda: [[i, *row]for i, row in enumerate(
        WS_CCO_INFORMA.get_values("A2:K"), 2)],
    "add": lambda dir, row, values: add_row_cco_informa(dir, row, values),
    "del": lambda row: WS_CCO_INFORMA.delete_rows(row),
    "upd": lambda row, values: update_row_cco_informa(row, values)
}


if __name__ == "__main__":
    # print(INFORMATIONS["problemas"]["get"]())
    # print(WS_DADOS.get_values("B2:B"))
    # data = INFORMATIONS["cco-informa"]["cols"]()
    # for i in range(len(INFORMATIONS["cco-informa"]["cols"]())):
    #     print(i)
    print(INFORMATIONS["cco-informa"]["get"]())
    pass
