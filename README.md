# 🌱 Digital Garden

A small personal dashboard for organizing projects, ideas and things currently growing.

Digital Garden is a lightweight web application built as a personal space to track creative and technical projects through a simple garden-inspired interface.

> Currently in early development — more parts of the garden are still growing.

---

## ✦ Features

- Create personal projects
- View projects in an interactive dashboard
- Edit projects directly inside a modal
- Delete projects with confirmation
- Track project status and progress
- Persistent local storage with SQLite
- Dynamic interface updates without page reloads

---

## ✦ Built with

- Python
- Flask
- SQLite
- HTML
- CSS
- JavaScript

The frontend communicates with the Flask backend using JSON and the Fetch API for dynamic project creation and editing.

---

## ✦ Project structure

```text
digital-garden/
│
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
│
├── templates/
│   └── index.html
│
├── app.py
├── database.py
├── requirements.txt
└── README.md