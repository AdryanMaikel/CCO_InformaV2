"""

"""
from flask import Flask, render_template, request

from gsheets import INFORMATIONS as SHEETS
from db import contains_operator

LETTERS = SHEETS["cco-informa"]["letters"]()
COLUMNS = SHEETS["cco-informa"]["cols"]()

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/login", methods=["POST"])
def login():
    operator, password = request.form["operator"], request.form["password"]
    if not contains_operator(operator, password):
        return "not-found"
    return f"cco-informa?operator={operator}"


@app.route("/cco-informa")
def cco_informa():
    operator = request.args.get("operator")
    return render_template("cco-informa.html", letters=LETTERS, cols=COLUMNS,
                           rows=SHEETS["cco-informa"]["get"](), user=operator)


@app.errorhandler(404)
def page_not_found(error):
    error = ""
    return render_template("not-found.html", error=error)


if __name__ == "__main__":
    app.run(debug=True)
