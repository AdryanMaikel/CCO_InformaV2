from flask import Flask, render_template, request, abort, make_response

from datetime import datetime as dt, timedelta as td

from operators import Operators
from messages import Messages
from gsheets import Sheet

app = Flask(__name__, static_folder="src", template_folder="pages")

operators = Operators()
messages = Messages()
cco_informa = Sheet("Histórico de eventos")


@app.route("/")
def index():
    operator, password = "", ""
    cookie_login = request.cookies.get("login", None)
    if cookie_login and cookie_login.__contains__("/"):
        operator, password = cookie_login.split("/")
        if operators.check_password(operator, password):
            operators.toggle_online(operator, password, online=True)
    return render_template("index.html", operator=operator, password=password)


@app.route("/login", methods=["GET", "POST"])
def toggle_login():
    if request.method == "GET":
        return abort(404)
    operator = request.form.get("operator", None)
    password = request.form.get("password", None)
    if (not operator or not password or operator not in operators.get()
            or not operators.check_password(operator, password)):
        return "Operador ou senha inválidos."

    response = f"Logado {operator}!"
    cookie_login = request.cookies.get("login", None)
    cookie_value = f"{operator}/{password}"
    operators.toggle_online(operator, password, online=True)
    if cookie_login and cookie_login == cookie_value:
        return response
    cookie = make_response(response)
    cookie.set_cookie("login", cookie_value)
    return cookie


@app.route("/unlogin", methods=["GET", "POST"])
def unlogin():
    operator = request.form.get("operator", None)
    password = request.form.get("password", None)
    if (not operator or not password or request.method == "GET"
            or not operators.check_password(operator, password)):
        return abort(404)
    operators.toggle_online(operator, password, online=False)
    return f"{operator} deslogado."


@app.route("/chat/<operator>/<password>", methods=["GET"])
def get_messages(operator, password):
    if not operators.check_password(operator, password):
        return render_template("messages.html", grouped_messages=[], name="")

    grouped_messages = messages.get()
    return render_template("messages.html", grouped_messages=grouped_messages,
                           name=operator)


@app.route("/post-message", methods=["GET", "POST"])
def post_message():
    operator = request.form.get("operator", None)
    password = request.form.get("password", None)
    message = request.form.get("message", None)
    if (not operator or not password or not message or request.method == "GET"
            or not operators.check_password(operator, password)):
        return abort(404)
    return messages.insert(operator, message)


@app.route("/cco-informa/<operator>/<password>", methods=["GET"])
def get_table(operator, password):
    if not operators.check_password(operator, password):
        return abort(404)
    rows = cco_informa.get_rows(dates=[])
    if not rows:
        return abort(404)
    last_row = len(rows) + 2
    now = (dt.now() - td(hours=3)).strftime("%d/%m/%Y")
    rows.append([last_row, now, "", "", "", "", "", "", "", "", "", operator])
    return render_template("cco-informa.html",
                           users=operators.get(),
                           columns=cco_informa.columns,
                           letters=cco_informa.letters,
                           last_row=last_row,
                           rows=rows)


@app.route("/<method>/<operator>/<password>", methods=["GET", "POST"])
def actions(method: str, operator: str, password: str):
    if not operators.check_password(operator, password):
        return abort(404)
    if request.method == "GET":
        return abort(300)
    data = request.get_json()
    row = data.pop("row")
    if not row or not str(row).isnumeric():
        return abort(400)
    match method:
        case "remove":
            cco_informa.delete_row(row)
        case "insert":
            cco_informa.add_row(row, data)
        case "editing":
            cco_informa.update_row(row, data)
    return "Sucesso!"


if __name__ == "__main__":
    app.run(debug=True)
