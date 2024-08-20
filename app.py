from flask import Flask, render_template, request, make_response

from datetime import datetime as dt, timedelta as td, timezone

from operators import operators
from messages import messages
from gsheets import gsheet

app = Flask(__name__, static_folder="src", template_folder="pages")


@app.route("/")
def index():
    operator = password = ""
    cookie_login = request.cookies.get("login", None)
    if cookie_login and cookie_login.__contains__("/"):
        operator, password = cookie_login.split("/")
        if operators.check_password(operator, password):
            operators.toggle_online(operator, password, online=True)
    return render_template("index.html", operator=operator, password=password)


@app.route("/login", methods=["POST"])
def login():
    operator = request.form.get("operator", None)
    password = request.form.get("password", None)
    if (not operator or not password or operator not in operators.get()
            or not operators.check_password(operator, password)):
        return "Operador ou senha inválidos.", 400

    operators.toggle_online(operator, password, online=True)
    cookie_login = request.cookies.get("login", None)
    cookie_value = f"{operator}/{password}"
    response = f"Logado {operator}!"
    if cookie_login and cookie_login == cookie_value:
        return response
    cookie = make_response(response)
    date_expires = dt.now(timezone.utc) + td(days=10000)
    cookie.set_cookie("login", cookie_value, expires=date_expires)
    return cookie


@app.route("/unlogin", methods=["POST"])
def unlogin():
    operator = request.form.get("operator", None)
    password = request.form.get("password", None)
    if (not operator or not password or operator not in operators.get()
            or not operators.check_password(operator, password)):
        return "Operador ou senha inválidos.", 400
    operators.toggle_online(operator, password, online=False)
    return f"{operator} deslogado."


@app.route("/chat/<operator>/<password>", methods=["GET", "POST", "DELETE"])
def chat(operator, password):
    if operator not in operators.get():
        return "Operador não encontrado.", 400

    logged = operators.check_password(operator, password)

    if request.method.__eq__("GET"):
        groups = messages.get() if logged else []
        return render_template("messages.html", groups=groups, name=operator)

    if not logged:
        return "Operador ou senha inválidos.", 400

    data = dict(request.get_json())
    if not data:
        return "JSON invalido.", 400

    if request.method.__eq__("POST"):
        message = data.pop("message", None)
        if not message:
            return "Mensagem invalida.", 400
        return messages.insert(operator, message)

    if request.method.__eq__("DELETE"):
        row = data.pop("row", None)
        if not row or not str(row).isnumeric():
            return "ID Invalido.", 400
        messages.hidden(row)
        return "Sucesso!"


@app.route("/table/<operator>/<password>",
           methods=["GET", "POST", "PUT", "DELETE"])
def table(operator, password):
    if operator not in operators.get():
        return "Operador não encontrado.", 400

    logged = operators.check_password(operator, password)
    if not logged:
        return "Operador ou senha inválidos.", 400

    if request.method.__eq__("GET"):
        rows = gsheet.get_rows(dates=[])
        last_row = len(rows) + 2
        now = (dt.now() - td(hours=3)).strftime("%d/%m/%Y")
        rows.append(
            [last_row, now, "", "", "", "", "", "", "", "", "", operator]
            )
        return render_template("cco-informa.html",
                               users=operators.get(),
                               columns=gsheet.columns,
                               letters=gsheet.letters,
                               last_row=last_row, rows=rows)

    data = dict(request.get_json())
    row = data.pop("row", None)
    if not row or not str(row).isnumeric():
        return "Número da linha invalido.", 400

    match request.method:
        case "DELETE":
            gsheet.delete_row(row)
        case "POST":
            gsheet.add_row(row, data)
        case "PUT":
            gsheet.update_row(row, data)
    return "Sucesso!"


@app.route("/scripts/<operator>/<password>")
def scripts(operator, password):
    logged = operators.check_password(operator, password)
    if not logged:
        return "Operador ou senha inválidos.", 400
    scripts = ("/src/js/logged/table.js,"
               "/src/js/logged/chat.js,"
               "/src/js/logged/config.js,"
               "/src/js/logged/wpp.js")
    return scripts


@app.route("/wpp/<operator>/<password>")
def wpp(operator, password):
    logged = operators.check_password(operator, password)
    if not logged:
        return "Operador ou senha inválidos.", 400
    if request.method == "GET":
        emps = ["Navegantes", "Nortran", "Sopal"]
        sentidos = ["BC", "CB", "CC", "TB", "BT", "TT"]
        events = ["adiantada", "atrasada", "interrompida", "perdida",
                  "realizada a frente"]
        motives = ['Acidente', 'Adiantado com autorização',
                   'Adiantado sem autorização', 'Assalto', 'Atrasado',
                   'Avaria', 'Congestionamento', 'Falta de Carro',
                   'Falta de Tripulação',
                   'GPS com problemas de Comunicação', 'Pneu Furado',
                   'Problema com passageiro', 'Problemas mecânicos',
                   'Tempo insuficiente', 'Validador/ Roleta', 'Vandalismo',
                   'Vistoria EPTC']
        return render_template("wpp.html",
                               emps=emps,
                               sentidos=sentidos,
                               events=events,
                               motives=motives
                               )
    return ""


if __name__ == "__main__":
    app.run(debug=True)
