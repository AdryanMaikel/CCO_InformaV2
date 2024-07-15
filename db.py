import sqlite3 as sql


def execute(query: str, params: tuple = (), commit: bool = True) -> list:
    """Executa uma consulta SQL com os parâmetros fornecidos.

    :param query: str - Consulta SQL a ser executada.
    :param params: tuple - Parâmetros a serem usados na consulta.
    :param commit: bool - Se True, realiza o commit da transação.
    :return: list - Lista de resultados da consulta.
    """
    try:
        with sql.connect("database.db") as connection:
            cursor = connection.cursor()
            cursor.execute(query, params)
            if commit:
                connection.commit()
                return []
            rows = cursor.fetchall()
            return [row if len(row) > 1 else row[0] for row in rows]
    except sql.Error as erro:
        print(f"Erro ao executar a query:\n{query}\n\n"
              f"com os paramâtros:\n{params}\n\nerro: {erro}")
        return []


if __name__ == "__main__":
    rows = execute(
        query="select * from operators", commit=False
    )
    for row in rows:
        print(row)
    # print(execute("SELECT * FROM operators Where id = 1", commit=False))
