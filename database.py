import sqlite3


def init_db():
    connection = sqlite3.connect("database.db")

    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            status TEXT NOT NULL DEFAULT 'seedling',
            progress INTEGER NOT NULL DEFAULT 0
        )
        """
    )

    connection.commit()
    connection.close()

    print("Digital Garden database created successfully 🌱")


if __name__ == "__main__":
    init_db()