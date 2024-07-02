from flask import Flask, render_template, request, abort
from db import operators

app = Flask(__name__, static_folder="src", template_folder="pages")

check_pass = operators["check_password"]


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return abort(404)
    operator, _pass = request.form["operator"], request.form["password"]
    if operator not in operators["get"] or not check_pass(operator, _pass):
        return "Operador ou senha inválidos."
    return "Logado"


if __name__ == "__main__":
    app.run(debug=True)
