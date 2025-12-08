# Architecture Documentation

This directory contains the architecture documentation for the Django-React Multi-Vendor E-commerce Platform using [Structurizr](https://structurizr.com/).

## What is Structurizr?

Structurizr is a tool for visualizing software architecture using the C4 model (Context, Containers, Components, and Code). Instead of using drag-and-drop diagram tools, architecture is defined as code in a DSL (Domain Specific Language) file, making it:

- **Version-controllable**: Track changes in Git
- **Maintainable**: Update diagrams by editing text
- **Consistent**: Automatic layout and styling
- **Multi-view**: Generate multiple diagram perspectives from one model

## Quick Start

### Prerequisites

- Docker installed on your system

### View Architecture Diagrams

1. **Start Structurizr Lite**:
   ```bash
   docker run -it --rm -p 8080:8080 \
     -v /Volumes/m2-havas-pronto/personal/uit/python/django-react-ecommerce/docs/architecture:/usr/local/structurizr \
     structurizr/lite
   ```

2. **Open in Browser**:
   Navigate to [http://localhost:8080](http://localhost:8080)

3. **Stop Structurizr**:
   Press `Ctrl+C` in the terminal where Docker is running

### Edit Architecture

1. Edit the `workspace.dsl` file in this directory
2. Save your changes
3. Refresh the browser to see updates (Structurizr auto-reloads every 5 seconds)

## Architecture Overview

This project is a full-stack multi-vendor e-commerce platform with the following architecture:

### System Components

- **Frontend**: React 18.2 SPA with Vite, Zustand state management
- **Backend**: Django 4.2.7 REST API with Django REST Framework
- **Database**: SQLite (development) / PostgreSQL (production ready)
- **Storage**: Local filesystem / AWS S3 (configurable)
- **External Services**: 
  - Stripe & PayPal for payments
  - Mailgun for transactional emails

### Key Features

- **Multi-tenancy**: Supports multiple vendors with isolated shops
- **Product Management**: Categories, brands, variants (colors, sizes), galleries
- **Shopping Cart**: Session-based for anonymous users, persistent for logged-in users
- **Order Management**: Full order lifecycle with delivery tracking
- **Payment Processing**: Integrated Stripe and PayPal checkout
- **Review System**: Product reviews with ratings and helpful votes
- **Vendor Dashboard**: Analytics, revenue charts, order fulfillment
- **Customer Portal**: Order history, wishlist, notifications
- **Coupon System**: Discount codes with usage tracking
- **Email Notifications**: Automated emails for order events

## Available Diagrams

The `workspace.dsl` file generates the following views:

### 1. System Context Diagram (`SystemContext`)
Shows the big picture: users (Customer, Vendor, Admin), the e-commerce system, and external dependencies (Stripe, PayPal, Mailgun).

**Use for**: Understanding system boundaries and external integrations

### 2. Container Diagram (`Containers`)
Shows the major applications and data stores:
- React SPA (frontend)
- Django REST API (backend)
- SQLite Database
- Media Storage

**Use for**: Understanding the high-level technical architecture

### 3. Frontend Components Diagram (`FrontendComponents`)
Detailed view of the React application structure:
- Authentication Module
- Shop Module (products, cart, checkout)
- Customer Module (orders, wishlist)
- Vendor Module (dashboard, analytics)
- State Management (Zustand, Context)
- Utilities (API client, token manager)

**Use for**: Understanding frontend code organization

### 4. Backend Components Diagram (`BackendComponents`)
Detailed view of the Django API structure:
- User Authentication App
- Store App (products, cart, orders, reviews)
- Vendor App (shop management, analytics)
- Customer App (customer features)
- Addon App (configuration)
- Payment Processor
- Notification System

**Use for**: Understanding backend code organization

### 5. Order Flow Diagram (`OrderFlow`)
Dynamic diagram showing the complete order process:
1. Add products to cart
2. Create order
3. Apply coupon
4. Payment processing (Stripe)
5. Email confirmation

**Use for**: Understanding business processes and data flow

## Django Apps Overview

### Core Apps

- **`userauths`**: User authentication, JWT tokens, profiles
- **`store`**: Products, categories, brands, cart, orders, reviews, wishlist, coupons
- **`vendor`**: Vendor shops, analytics, notifications, 30+ endpoints
- **`customer`**: Customer-specific features and account management
- **`addon`**: Platform configuration (currency, fees, tax rates)

### Key Models

- **User/Profile**: Email-based authentication with OTP and password reset
- **Product**: 40+ fields including pricing, stock, variants, ratings
- **Cart/CartOrder/CartOrderItem**: Shopping cart and order management
- **Vendor**: Shop details, verification status
- **Review**: Product reviews with ratings (1-5 stars)
- **Coupon**: Discount codes with usage tracking
- **Notification**: User and vendor notifications

### API Structure

All APIs are RESTful and prefixed with `/api/v1/`:
- Authentication: `/api/v1/user/`
- Store: `/api/v1/products/`, `/api/v1/cart-view/`, `/api/v1/checkout/`
- Vendor: `/api/v1/vendor/`
- Customer: `/api/v1/customer/`

## React App Structure

### Routing

- **Public Routes**: Home, product listing, product detail, cart, checkout
- **Auth Routes**: Login, register, password reset
- **Customer Routes**: `/customer/*` - Dashboard, orders, wishlist, notifications
- **Vendor Routes**: `/vendor/*` - Dashboard, products, orders, analytics, coupons

### State Management

- **Zustand Store**: Global authentication state (user, vendor info)
- **React Context**: Cart count, profile data
- **LocalStorage**: Cart session ID, JWT tokens (via js-cookie)

### Key Libraries

- **React Router**: Navigation and protected routes
- **Axios**: HTTP client with JWT token injection
- **Chart.js**: Vendor analytics dashboards
- **CKEditor**: Rich text editing for product descriptions
- **SweetAlert2**: User notifications
- **PayPal SDK**: Payment integration

## Development Workflow

### Making Changes to Architecture

1. Identify what changed in your codebase (new feature, refactoring, etc.)
2. Update `workspace.dsl` to reflect the changes
3. Review diagrams in the browser
4. Commit the updated `workspace.dsl` to Git

### Best Practices

- **Keep it updated**: Update diagrams when architecture changes
- **Be consistent**: Use consistent naming conventions
- **Add descriptions**: Include meaningful descriptions for components
- **Review regularly**: Use diagrams in code reviews and planning sessions
- **Export diagrams**: Save PNG/SVG versions for documentation

## Export Diagrams

To export diagrams for use in presentations or documentation:

1. Open Structurizr Lite at http://localhost:8080
2. Select a diagram view
3. Click the download icon (camera icon) in the top right
4. Choose PNG or SVG format

## Resources

- [Structurizr DSL Documentation](https://docs.structurizr.com/dsl)
- [Structurizr DSL Language Reference](https://docs.structurizr.com/dsl/language)
- [C4 Model](https://c4model.com/)
- [Structurizr Lite Docker Image](https://hub.docker.com/r/structurizr/lite)

## Project Technology Stack

### Backend
- Python 3.11
- Django 4.2.7
- Django REST Framework 3.14.0
- djangorestframework-simplejwt (JWT authentication)
- drf-yasg (Swagger/OpenAPI documentation)
- django-anymail (Mailgun integration)
- Pillow (image processing)
- stripe, paypalrestsdk (payments)

### Frontend
- React 18.2.0
- Vite 4.4.5
- React Router DOM 6.10.0
- Zustand 4.4.4 (state management)
- Axios 1.5.1
- Chart.js 4.4.0
- CKEditor 5
- SweetAlert2 11.7.32

### Database
- SQLite 3 (development)
- PostgreSQL support (production)

### Deployment
- Heroku-ready (Procfile, runtime.txt)
- AWS S3 support (commented out in settings)

## Maintenance

This architecture documentation should be updated whenever:

- New features are added (new Django apps, React modules)
- Major refactoring occurs
- External integrations change
- Deployment architecture changes
- Database schema significantly changes

Keep the diagrams in sync with the actual codebase to maintain their value as documentation.
