"""

"""
from flask import Flask, render_template

from gsheets import INFORMATIONS as SHEETS

LETTERS = SHEETS["cco-informa"]["letters"]()
COLUMNS = SHEETS["cco-informa"]["cols"]()

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/login")
def login():
    return render_template("")


@app.route("/cco-informa")
def cco_informa():
    return render_template("cco-informa.html", letters=LETTERS, cols=COLUMNS,
                           rows=SHEETS["cco-informa"]["get"]())


@app.errorhandler(404)
def page_not_found(error):
    error = ""
    return render_template("not-found.html", error=error)


if __name__ == "__main__":
    app.run(debug=True)
