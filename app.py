from flask import Flask, render_template, request, abort, make_response
from db import operators, messages

app = Flask(__name__, static_folder="src", template_folder="pages")

check_pass = operators["check_password"]


@app.route("/")
def index():
    operator, password = request.cookies.get("login", "/").split("/")
    if not check_pass(operator, password):
        print("Não está loggado")
    return render_template("index.html", operator=operator, password=password)


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return abort(404)

    operator, _pass = request.form["operator"], request.form["password"]
    if operator not in operators["get"] or not check_pass(operator, _pass):
        return "Operador ou senha inválidos."

    response = f"operator:{operator}/routes:cco-informa,chat"
    if not request.cookies.get("login", None):
        cookie = make_response(response)
        cookie.set_cookie("login", f"{operator}/{_pass}")
        return cookie
    return response


@app.route("/chat/<operator>/<password>", methods=["GET"])
def get_messages(operator, password):
    if not check_pass(operator, password):
        abort(404)
    return render_template("messages.html", messages=messages["get"](),
                           name=operator)


if __name__ == "__main__":
    app.run(debug=True)
