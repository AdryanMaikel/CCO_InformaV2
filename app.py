from flask import Flask, render_template, request, abort
from db import users

app = Flask(__name__, static_folder="src", template_folder="pages")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return abort(404)
    user, _pass = request.form["user"], request.form["password"]
    if user not in users["get"] or not user["check_password"](user, _pass):
        return "Usuário ou senha inválidos."
    return "Logado"


if __name__ == "__main__":
    app.run(debug=True)
