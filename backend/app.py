
import mariadb
import sys
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

# ---------------- DATABASE CONFIG ----------------
DB_CONFIG = {
    "host": "betq3aai8nwgzf2qcexd-mysql.services.clever-cloud.com",
    "user": "uivas9d1jvmvtl9m",
    "password": "0bAczNeUXT22YgeCANOp",
    "database": "betq3aai8nwgzf2qcexd"
}

BODY_PART_CODES = {
    "eye": "EYE1",
    "gynac": "GYNAC2",
    "joints": "JOINTS3",
    "hair": "HAIR4",
    "ent": "ENT5",
    "teeth": "DENTIST6"
}

APPOINTMENTS_TABLE = "APPOINTMENTS"

# ---------------- FLASK APP ----------------
app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)


# ---------------- DATABASE CLASS ----------------
class DatabaseConnection:
    def __init__(self):
        try:
            self.conn = mariadb.connect(DB_CONFIG)
            self.cursor = self.conn.cursor()
        except mariadb.Error as e:
            print("Database connection error:", e)
            sys.exit(1)

    def query(self, sql, params=None):
        try:
            self.cursor.execute(sql, params or ())
            return self.cursor.fetchall()
        except mariadb.Error as e:
            return None

    def execute(self, sql, params=None):
        try:
            self.cursor.execute(sql, params or ())
            self.conn.commit()
            return True
        except mariadb.Error:
            return False

    def close(self):
        self.conn.close()


# ---------------- CREATE APPOINTMENTS TABLE ----------------
db_init = DatabaseConnection()
db_init.execute(f"""
CREATE TABLE IF NOT EXISTS {APPOINTMENTS_TABLE} (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor VARCHAR(255),
    body_part VARCHAR(50),
    appt_date DATE,
    appt_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
""")
db_init.close()


# ---------------- ROUTES ----------------

@app.route("/")
def serve_home():
    # prefer serving the edited frontend file if present
    import os
    if os.path.exists("1st file.html"):
        return send_from_directory(".", "1st file.html")
    return send_from_directory(".", "index.html")


@app.route("/api/doctors")
def get_doctors():
    category = request.args.get("category", "").lower()

    if category not in BODY_PART_CODES:
        return jsonify(error="Invalid category"), 400

    db = DatabaseConnection()
    table = BODY_PART_CODES[category]
    rows = db.query(f"SELECT * FROM {table}")
    db.close()

    return jsonify(doctors=[list(r) for r in (rows or [])])


@app.route("/api/appointments", methods=["POST"])
def book_appointment():
    data = request.json

    doctor = data.get("doctor")
    body_part = data.get("body_part")
    appt_date = data.get("appt_date")
    appt_time = data.get("appt_time")

    if not doctor or not appt_date or not appt_time:
        return jsonify(error="Missing fields"), 400

    db = DatabaseConnection()
    success = db.execute(
        f"INSERT INTO {APPOINTMENTS_TABLE} (doctor, body_part, appt_date, appt_time) VALUES (?, ?, ?, ?)",
        (doctor, body_part, appt_date, appt_time)
    )
    db.close()

    if success:
        return jsonify(success=True)
    else:
        return jsonify(error="Database error"), 500


@app.route("/api/appointments", methods=["GET"])
def list_appointments():
    db = DatabaseConnection()
    rows = db.query(f"SELECT doctor, body_part, appt_date, appt_time, created_at FROM {APPOINTMENTS_TABLE} ORDER BY created_at DESC")
    db.close()
    # normalize to strings for JSON
    out = []
    for r in (rows or []):
        out.append([str(c) for c in r])
    return jsonify(appointments=out)


if __name__ == "__main__":
    print("Server running on http://localhost:5000")
    app.run()