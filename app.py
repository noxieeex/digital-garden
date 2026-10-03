import sqlite3

from flask import Flask, render_template, request, redirect, url_for, jsonify

app = Flask(__name__)


# ==================================================
# DATABASE
# ==================================================

def get_db_connection():
    connection = sqlite3.connect("database.db")
    connection.row_factory = sqlite3.Row

    return connection


# ==================================================
# HOME
# ==================================================

@app.route("/")
def home():

    connection = get_db_connection()

    projects = connection.execute(
        "SELECT * FROM projects"
    ).fetchall()

    connection.close()

    return render_template(
        "index.html",
        projects=projects
    )


# ==================================================
# CREATE PROJECT
# ==================================================

@app.route("/projects/new", methods=["POST"])
def new_project():

    data = request.get_json()

    if data is None:

        return jsonify({
            "success": False,
            "message": "No data received."
        }), 400


    name = data.get("name", "").strip()
    description = data.get("description", "").strip()
    status = data.get("status", "seedling")
    progress = data.get("progress", 0)


    # ---------- VALIDATION ----------

    if not name:

        return jsonify({
            "success": False,
            "message": "Project name is required."
        }), 400


    try:
        progress = int(progress)

    except (TypeError, ValueError):
        progress = 0


    progress = max(0, min(progress, 100))


    if status not in ["seedling", "growing"]:
        status = "seedling"


    # ---------- DATABASE ----------

    connection = get_db_connection()

    cursor = connection.execute(
        """
        INSERT INTO projects (
            name,
            description,
            status,
            progress
        )
        VALUES (?, ?, ?, ?)
        """,
        (
            name,
            description,
            status,
            progress
        )
    )

    connection.commit()

    project_id = cursor.lastrowid

    connection.close()


    # ---------- RESPONSE ----------

    return jsonify({
        "success": True,
        "project": {
            "id": project_id,
            "name": name,
            "description": description,
            "status": status,
            "progress": progress,

            "edit_url": url_for(
                "edit_project",
                project_id=project_id
            ),

            "delete_url": url_for(
                "delete_project",
                project_id=project_id
            )
        }
    })


# ==================================================
# UPDATE PROJECT
# ==================================================

@app.route("/projects/<int:project_id>/edit", methods=["POST"])
def edit_project(project_id):

    data = request.get_json()

    if data is None:

        return jsonify({
            "success": False,
            "message": "No data received."
        }), 400


    name = data.get("name", "").strip()
    description = data.get("description", "").strip()
    status = data.get("status", "seedling")
    progress = data.get("progress", 0)


    # ---------- VALIDATION ----------

    if not name:

        return jsonify({
            "success": False,
            "message": "Project name is required."
        }), 400


    try:
        progress = int(progress)

    except (TypeError, ValueError):
        progress = 0


    progress = max(0, min(progress, 100))


    if status not in ["seedling", "growing"]:
        status = "seedling"


    # ---------- DATABASE ----------

    connection = get_db_connection()

    project = connection.execute(
        "SELECT * FROM projects WHERE id = ?",
        (project_id,)
    ).fetchone()


    if project is None:

        connection.close()

        return jsonify({
            "success": False,
            "message": "Project not found."
        }), 404


    connection.execute(
        """
        UPDATE projects
        SET
            name = ?,
            description = ?,
            status = ?,
            progress = ?
        WHERE id = ?
        """,
        (
            name,
            description,
            status,
            progress,
            project_id
        )
    )

    connection.commit()
    connection.close()


    # ---------- RESPONSE ----------

    return jsonify({
        "success": True,
        "project": {
            "id": project_id,
            "name": name,
            "description": description,
            "status": status,
            "progress": progress
        }
    })


# ==================================================
# DELETE PROJECT
# ==================================================

@app.route("/projects/<int:project_id>/delete", methods=["POST"])
def delete_project(project_id):

    connection = get_db_connection()

    connection.execute(
        "DELETE FROM projects WHERE id = ?",
        (project_id,)
    )

    connection.commit()
    connection.close()

    return redirect(url_for("home"))


# ==================================================
# RUN APP
# ==================================================

if __name__ == "__main__":
    app.run(debug=True)