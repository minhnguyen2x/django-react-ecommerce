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
- **API Router**: Central routing component
- **User Authentication App**: User, Profile models + Auth Views (JWT, register, password reset)
- **Store App**: 20 models including Product, Category, Tag, Brand, Gallery, Specification, Size, Color, Cart, CartOrder, CartOrderItem, Review, Wishlist, Address, Coupon, CouponUsers, Notification, CancelledOrder, DeliveryCouriers + Store Views (40+ endpoints) + Serializers
- **Vendor App**: Vendor model + Vendor Views (30+ endpoints for dashboard, products, orders, analytics, coupons, notifications)
- **Customer App**: Customer Views (orders, wishlist, notifications, settings)
- **Addon App**: ConfigSettings and Tax models for platform configuration
- **Payment Processor**: Stripe and PayPal integration
- **Notification System**: Django signals for automatic notifications

**Use for**: Understanding backend code organization and data models

### 5. Order Flow Diagram (`OrderFlow`)
Dynamic diagram showing the complete order process:
1. Add products to cart
2. Create order
3. Apply coupon
4. Payment processing (Stripe)
5. Email confirmation

**Use for**: Understanding business processes and data flow

## Django Apps Overview

### Core Apps (6 Django Apps)

- **`userauths`**: User authentication, JWT tokens, user profiles
- **`store`**: Complete e-commerce logic with 20 models (products, categories, brands, cart, orders, reviews, wishlist, coupons, delivery tracking)
- **`vendor`**: Vendor shops, analytics, notifications, 30+ API endpoints
- **`customer`**: Customer-specific features and account management
- **`addon`**: Platform configuration (currency, service fees, tax rates, 2FA settings)
- **`api`**: Central API routing for all apps under `/api/v1/`

### Key Models (20 Models in Store App)

- **Category**: Product categories with images and slugs
- **Tag**: Tags linked to categories
- **Brand**: Product brands with images
- **Product**: Main product model with 40+ fields (price, old_price, shipping_amount, stock_qty, in_stock, status, type, featured, hot_deal, special_offer, digital, views, orders, saved, rating)
- **Gallery**: Product images (many-to-many relationship with products)
- **Specification**: Product specifications (key-value pairs)
- **Size**: Product size variations with pricing
- **Color**: Product color variations with images and color codes
- **Cart**: Shopping cart items with session-based cart_id
- **CartOrder**: Order header with payment_status (paid/pending/processing/cancelled/initiated/failed/refunded) and order_status (Pending/Fulfilled/Partially Fulfilled/Cancelled)
- **CartOrderItem**: Order line items with delivery tracking (order_placed, processing, quality_check, shipped, arrived, delivered)
- **Review**: Product reviews with 1-5 star ratings and helpful/not helpful voting
- **Wishlist**: User wishlists
- **Address**: User shipping addresses
- **Coupon**: Percentage-based discount coupons (0-100%)
- **CouponUsers**: Tracks coupon usage per user
- **Notification**: User and vendor notifications
- **CancelledOrder**: Order cancellation tracking
- **DeliveryCouriers**: Delivery service providers
- **User/Profile** (userauths app): Email-based authentication with OTP and password reset
- **Vendor** (vendor app): Shop details with verification status

### API Structure (90+ Endpoints)

All APIs are RESTful and prefixed with `/api/v1/`:

**Authentication (8 endpoints):**
- `/api/v1/user/token/` - JWT token obtain
- `/api/v1/user/token/refresh/` - Token refresh
- `/api/v1/user/register/` - User registration
- `/api/v1/user/profile/<user_id>/` - User profile
- `/api/v1/user/password-reset/<email>/` - Password reset email
- `/api/v1/user/password-change/` - Password change

**Store (20+ endpoints):**
- `/api/v1/category/`, `/api/v1/brand/` - List categories and brands
- `/api/v1/products/`, `/api/v1/featured-products/` - Product listings
- `/api/v1/products/<slug>/` - Product detail
- `/api/v1/cart-view/`, `/api/v1/cart-list/<cart_id>/` - Cart operations
- `/api/v1/create-order/`, `/api/v1/checkout/<order_oid>/` - Order creation
- `/api/v1/stripe-checkout/<order_oid>/` - Stripe payment
- `/api/v1/payment-success/` - Payment confirmation
- `/api/v1/coupon/` - Apply coupon
- `/api/v1/create-review/`, `/api/v1/reviews/<product_id>/` - Reviews
- `/api/v1/search/` - Product search

**Customer (6 endpoints):**
- `/api/v1/customer/orders/<user_id>/` - Order history
- `/api/v1/customer/order/detail/<user_id>/<order_oid>/` - Order detail
- `/api/v1/customer/wishlist/create/`, `/api/v1/customer/wishlist/<user_id>/` - Wishlist
- `/api/v1/customer/notification/<user_id>/` - Notifications
- `/api/v1/customer/setting/<pk>/` - Account settings

**Vendor (30+ endpoints):**
- `/api/v1/vendor/stats/<vendor_id>/` - Dashboard statistics
- `/api/v1/vendor/products/<vendor_id>/` - Product management
- `/api/v1/vendor/orders/<vendor_id>/` - Order management
- `/api/v1/vendor/yearly-report/<vendor_id>/` - Analytics
- `/api/v1/vendor/earning/<vendor_id>/` - Revenue tracking
- `/api/v1/vendor/reviews/<vendor_id>/` - Review management
- `/api/v1/vendor/coupon-list/<vendor_id>/` - Coupon management
- `/api/v1/vendor/notifications-unseen/<vendor_id>/` - Notifications
- `/api/v1/vendor/settings/<pk>/`, `/api/v1/vendor/shop-settings/<pk>/` - Settings
- `/api/v1/shop/<vendor_slug>/` - Public shop view
- `/api/v1/vendor/register/` - Vendor registration
- `/api/v1/vendor/couriers/` - Delivery couriers
- `/api/v1/vendor/order-item-detail/<pk>/` - Item tracking

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
