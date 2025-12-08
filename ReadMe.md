# Django React E-commerce Website

A full-stack e-commerce platform built with Django REST Framework (backend) and React + Vite (frontend).

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Python 3.9.16** (recommended) or Python 3.12+
- **Node.js** (v16 or higher) and **npm**
- **pip** (Python package manager)
- **Git**

## Project Structure

```
django-react-ecommerce/
├── backend/          # Django REST Framework API
│   ├── manage.py
│   ├── requirements.txt
│   ├── db.sqlite3
│   └── ...
└── frontend/         # React + Vite application
    ├── package.json
    ├── vite.config.js
    └── ...
```

---

## Backend Setup (Django)

### 1. Navigate to the backend directory

```bash
cd backend
```

### 2. Create a virtual environment

```bash
python3 -m venv venv
```

### 3. Activate the virtual environment

**On macOS/Linux:**
```bash
source venv/bin/activate
```

**On Windows:**
```bash
venv\Scripts\activate
```

### 4. Install Python dependencies

```bash
pip install -r requirements.txt
```

**Note:** If you encounter missing module errors (like `tinymce` or `setuptools`), install them:

```bash
pip install setuptools django-tinymce
```

### 5. Configure environment variables

Create a `.env` file in the `backend` directory (or update the existing one) with the following variables:

```env
# Site Configuration
SITE_URL=http://localhost:5173

# Payment Gateways
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET_ID=your_paypal_secret_id

# Email Configuration (Mailgun)
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_SENDER_DOMAIN=your_mailgun_domain

# Database (optional - defaults to SQLite)
# DATABASE_URL=postgres://user:password@localhost:5432/dbname

# AWS S3 (optional - for media storage)
# AWS_ACCESS_KEY_ID=your_aws_access_key
# AWS_SECRET_ACCESS_KEY=your_aws_secret_key
# AWS_STORAGE_BUCKET_NAME=your_bucket_name
```

**For local development**, you can leave the payment and email keys empty or use test credentials.

### 6. Run database migrations

```bash
python manage.py migrate
```

### 7. Create a superuser (admin account)

```bash
python manage.py createsuperuser
```

Follow the prompts to create your admin username, email, and password.

### 8. Start the Django development server

```bash
python manage.py runserver
```

The backend will be available at: **http://127.0.0.1:8000/**

**Access Points:**
- **API Endpoints:** http://127.0.0.1:8000/api/
- **Admin Panel:** http://127.0.0.1:8000/admin/
- **API Documentation:** http://127.0.0.1:8000/swagger/ or http://127.0.0.1:8000/redoc/

---

## Frontend Setup (React + Vite)

### 1. Open a new terminal and navigate to the frontend directory

```bash
cd frontend
```

### 2. Install Node dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The frontend will be available at: **http://localhost:5173/**

---

## Running the Complete Application

To run both backend and frontend simultaneously:

1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   python manage.py runserver
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and go to **http://localhost:5173/**

---

## Common Issues & Solutions

### Issue: `ModuleNotFoundError: No module named 'pkg_resources'`
**Solution:** Install setuptools
```bash
pip install setuptools
```

### Issue: `ModuleNotFoundError: No module named 'tinymce'`
**Solution:** Install django-tinymce
```bash
pip install django-tinymce
```

### Issue: `WARNING: No DATABASE_URL environment variable set`
**Solution:** This is normal when using SQLite (the default database). You can safely ignore this warning for local development.

### Issue: Frontend can't connect to backend
**Solution:** 
- Ensure the backend is running on http://127.0.0.1:8000/
- Check CORS settings in `backend/backend/settings.py`
- Verify `SITE_URL` in backend `.env` file is set to `http://localhost:5173`

---

## Database

By default, the project uses **SQLite** (`db.sqlite3`) for local development. For production, you can configure PostgreSQL by setting the `DATABASE_URL` environment variable in your `.env` file.

---

## Technologies Used

### Backend
- Django 4.2.7
- Django REST Framework
- Django CORS Headers
- Django Simple JWT (Authentication)
- Stripe & PayPal (Payment Integration)
- drf-yasg (API Documentation)
- Django Jazzmin (Admin Interface)

### Frontend
- React 18.2.0
- Vite
- React Router DOM
- Axios
- Chart.js
- PayPal React SDK
- SweetAlert2

---

## Additional Commands

### Backend

**Collect static files:**
```bash
python manage.py collectstatic
```

**Create new app:**
```bash
python manage.py startapp app_name
```

**Make migrations after model changes:**
```bash
python manage.py makemigrations
python manage.py migrate
```

### Frontend

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

**Lint code:**
```bash
npm run lint
```

---

## License

This project is open source and available for educational purposes.

---

## Support

For issues or questions, please create an issue in the repository.