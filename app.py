from flask import Flask, render_template, request, abort, make_response
from db import Operators, Messages


app = Flask(__name__, static_folder="src", template_folder="pages")

operators = Operators()
messages = Messages()


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
def login():
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
    if not cookie_login or cookie_login != cookie_value:
        cookie = make_response(response)
        cookie.set_cookie("login", cookie_value)
        return cookie
    return response


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
    messages.insert(operator, message)
    return f"Mensagem de {operator} inserida com sucesso." +\
        f"mensagem:\n{message}"


if __name__ == "__main__":
    app.run(debug=True)
