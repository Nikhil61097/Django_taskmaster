# Django Task Manager

A simple multi-user task management web application built with Django and Django REST Framework.

## Features

- User registration and login with session-based authentication.
- Role-based access control:
  - **Managers** (`is_staff`) can view, create, assign, edit, and delete tasks for any user.
  - **Regular users** can view and manage only their own tasks.
- Task management with title, completion status, and optional user assignment.
- REST API backend with React/vanilla JS frontend integration.
- User-friendly dashboard for task display and management.
- Admin views for managing users and tasks.
- Graceful handling of unassigned tasks and deleted users (tasks remain with "Unassigned" user).

## Tech Stack

- Python 3.x, Django 4.x
- Django REST Framework
- SQLite (default, easily switchable to PostgreSQL or others)
- JavaScript (vanilla ES6+)
- HTML5 & CSS3 (with plans for styling improvements)

## Setup & Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/django-task-manager.git
   cd django-task-manager
