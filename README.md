# 🏗️ Django Multivendor Application Overview

Welcome to the overall documentation for the Django Multivendor E-commerce Platform. This guide covers the application's architecture, configuration, and key features.

---

## 🗺️ Application Architecture

- **Backend (Django):**  
  Provides RESTful endpoints, authentication (JWT), and business logic.
- **Frontend (React):**  
  Interacts with the backend API for a seamless shopping experience.
- **Database:**  
  Uses SQLite (development) with plans for scaling to PostgreSQL in production.
- **Authentication:**  
  JWT-based authentication combined with social logins (Google & Facebook).

- **Third-party Integration:**  
  Utilizes django-extensions, social-auth, and django-cors-headers for extended functionality.

---

## 🚀 Key Features

- Multi-vendor marketplace allowing each vendor to manage their products.
- User authentication and social login integration.
- Cart mechanism to add, update and remove products.
- Order management with real-time logging and detailed error handling.
- Payment processing and vendor payouts.
- Comprehensive logging and request/response tracking for troubleshooting.

---

## ⚙️ Setup & Configuration

- **Environment Variables:**  
  Set up via the frontend `.env` file and backend settings in `settings.py`.
- **SSL & Security:**  
  Self-signed certificates are automatically generated for development.  
  Production setups should replace these with certificates from a trusted CA.
- **CORS Configuration:**  
  Supports both `localhost` and `127.0.0.1` for frontend development environments.

- **Logging:**  
  All application requests and responses are logged to `debug.log` for easier debugging.

---

## 🛠️ Running the Application

1. Install dependencies:
   - Backend: `pip install -r requirements.txt`
   - Frontend: `npm install`
2. Run the Django server (with SSL enabled in development):
   - `python run_ssl.py`
3. Start the React development server:
   - `npm start`

For additional customization, refer to specific configuration files for logs, social authentication, and middleware settings in the project.

---

## Database Setup

Before running the application for the first time, you need to initialize the database:

### Option 1: Using the initialization script

Run the `init_database.bat` script:

```bash
./init_database.bat
```

### Option 2: Using Django management commands

```bash
cd backend
python manage.py makemigrations token_blacklist
python manage.py migrate token_blacklist
python manage.py migrate
```

## First-time Error Resolution

If you encounter the error: `sqlite3.OperationalError: no such table: token_blacklist_outstandingtoken`, follow these steps:

1. Stop the Django server
2. Run the database initialization as described above
3. Restart the Django server

---

Happy developing! 🎉
