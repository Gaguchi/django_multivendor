# 🏗️ Django Multivendor E-commerce Platform

Welcome to the Django Multivendor E-commerce Platform with **GPT-4o AI Search**! This is a comprehensive multivendor marketplace with intelligent product search capabilities.

---

## 🚀 Quick Start

### 1. Setup AI Search (Recommended)

**Linux/Mac:**

```bash
bash setup/setup_ai_search.sh
```

**Windows:**

```cmd
setup\setup_ai_search.bat
```

### 2. Install Dependencies

**Backend:**

```bash
cd backend
pip install -r requirements.txt
```

**Frontend:**

```bash
cd frontend
npm install
```

### 3. Run the Application

**Backend:**

```bash
cd backend
python manage.py runserver
```

**Frontend:**

```bash
cd frontend
npm start
```

---

## 🗺️ Application Architecture

- **Backend (Django):** RESTful API with JWT authentication and **GPT-4o AI search**
- **Frontend (React):** Modern UI with intelligent search interface
- **Database:** SQLite (development) → PostgreSQL (production)
- **AI Search:** GitHub Copilot API integration for GPT-4o powered search
- **Authentication:** JWT + Social logins (Google & Facebook)

---

## 🎯 Key Features

### � E-commerce Core

- Multi-vendor marketplace with individual vendor dashboards
- Shopping cart and order management
- Payment processing and vendor payouts
- User authentication and profile management

### 🤖 AI-Powered Search

- **GPT-4o integration** via GitHub Copilot API
- Natural language product search
- Intelligent tag generation and categorization
- Semantic search with relevance ranking
- Fallback to keyword search when needed

### 📁 Clean Architecture

- Organized project structure with `/tests` directory
- Consolidated setup scripts in `/setup`
- Comprehensive documentation in `/docs`
- Modular backend and frontend separation

---

## 📁 Project Structure

```
django_multivendor/
├── backend/           # Django API server
├── frontend/          # React application
├── vendor_dashboard/  # Vendor management interface
├── setup/            # Setup and configuration scripts
├── tests/            # All test files organized by type
├── docs/             # Documentation and guides
└── cloudflare/       # Deployment configuration
```

---

## 🛠️ Setup & Configuration

### Environment Variables

Configure via `.env` file (created automatically by setup scripts):

- `GITHUB_TOKEN` - GitHub Copilot API access
- `AI_SEARCH_DEBUG` - Enable AI search debugging
- `SECRET_KEY` - Django secret key
- `DEBUG` - Development mode flag

### Database Setup

```bash
cd backend
python manage.py migrate
python manage.py createsuperuser
```

### SSL & Security

- Development: Self-signed certificates auto-generated
- Production: Replace with trusted CA certificates
- CORS: Configured for `localhost` and `127.0.0.1`

---

## 🧪 Testing

All tests are organized in the `/tests` directory:

```
tests/
├── api/              # API endpoint tests
├── backend/          # Django backend tests
├── frontend/         # React component tests
├── jwt_auth/         # Authentication tests
└── websocket/        # Real-time feature tests
```

Run tests:

```bash
# Backend tests
cd backend && python manage.py test

# Frontend tests
cd frontend && npm test
```

---

## 🚨 Troubleshooting

### AI Search Issues

1. Verify GitHub Copilot subscription is active
2. Check token scopes: `read:user`, `user:email`, `copilot`
3. Enable debug mode: `AI_SEARCH_DEBUG=True` in `.env`

### Database Issues

If you see `sqlite3.OperationalError: no such table: token_blacklist_outstandingtoken`:

```bash
cd backend
python manage.py migrate token_blacklist
python manage.py migrate
```

### General Debugging

- Check `debug.log` for application logs
- Verify environment variables in `.env`
- Ensure all dependencies are installed

---

## 📚 Documentation

- **Setup Guide:** `/setup/README.md`
- **API Documentation:** `/docs/api/`
- **Implementation Guides:** `/docs/implementation/`
- **LLM Documentation:** `/docs/LLM_DOCUMENTATION.md`

---

**🎉 Happy developing with AI-powered search!** 🤖
