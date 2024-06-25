"""

"""
from flask import Flask, render_template, request, abort

from gsheets import INFORMATIONS as SHEETS
from db import contains_operator, update_status, messages

LETTERS = SHEETS["cco-informa"]["letters"]()
COLUMNS = SHEETS["cco-informa"]["cols"]()

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/login", methods=["POST"])
def login():
    name, password = request.form["operator"], request.form["password"]
    if not contains_operator(name, password):
        abort(404)
    return f"cco-informa/{name}/{password}"


@app.route("/cco-informa/<name>/<password>", methods=["GET"])
def cco_informa(name, password):
    if not contains_operator(name, password):
        abort(404)
    update_status(name, True)
    return render_template("cco-informa.html", letters=LETTERS, cols=COLUMNS,
                           rows=SHEETS["cco-informa"]["get"](), user=name)


@app.route("/logout/<operator>", methods=["POST"])
def logout(operator):
    try:
        update_status(operator, False)
        return f"{operator}, deslogado com sucesso!"
    except Exception as error:
        print(error)
        return "Falha ao deslogar."


@app.route("/chat/<name>/<password>", methods=["GET"])
def get_messages(name, password):
    if not contains_operator(name, password):
        abort(404)
    return render_template("chat.html", messages=messages["get"](), name=name)


@app.errorhandler(404)
def page_not_found(error):
    error = "404. Insira seu operador e senha."
    return render_template("not-found.html", error=error)


if __name__ == "__main__":
    app.run(debug=True)
