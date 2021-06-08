from flask.json import jsonify
from kakebo import app
from kakebo.dataaccess import DBmanager
from flask import jsonify, render_template
import sqlite3

dbManager = DBmanager(app.config.get("DATABASE"))

@app.route("/")
def listaMovimientos():
    return render_template("spa.html")

@app.route("/api/v1/movimientos")
def movimientosAPI():
    query = "SELECT * FROM movimientos order by fecha;"
    
    try:
        lista = dbManager.consultaMuchasSQL(query)
        return jsonify({"status": "success", "movimientos": lista})
    except sqlite3.Error as e:
        return jsonify({"status": "fail", "mensaje": str(e)})