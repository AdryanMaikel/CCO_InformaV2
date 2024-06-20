"""

"""
from flask import Flask, render_template, request

from gsheets import INFORMATIONS as SHEETS
from db import contains_operator, update_status

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
        return "not-found"
    return f"cco-informa/{name}"


@app.route("/cco-informa/<operator>", methods=["GET"])
def cco_informa(operator):
    update_status(operator, True)
    return render_template("cco-informa.html", letters=LETTERS, cols=COLUMNS,
                           rows=SHEETS["cco-informa"]["get"](), user=operator)


@app.route("/logout/<operator>", methods=["GET"])
def logout(operator):
    update_status(operator, False)
    print(operator)


@app.errorhandler(404)
def page_not_found(error):
    error = ""
    return render_template("not-found.html", error=error)


if __name__ == "__main__":
    app.run(debug=True)
