workspace "Django-React Multi-Vendor E-commerce Platform" "Architecture documentation for a full-stack e-commerce platform with vendor marketplace, payment processing, and order management" {

    !identifiers hierarchical

    model {
        # External Users/Actors
        customer = person "Customer" "End user who browses products, makes purchases, and manages orders"
        vendor = person "Vendor" "Shop owner who lists products, manages inventory, and fulfills orders"
        admin = person "Administrator" "Platform admin who manages site configuration and monitors operations"
        
        # External Systems
        stripeSystem = softwareSystem "Stripe Payment Gateway" "Processes credit card payments and manages transactions" {
            tags "External System"
        }
        paypalSystem = softwareSystem "PayPal Payment Gateway" "Processes PayPal payments and manages transactions" {
            tags "External System"
        }
        mailgunSystem = softwareSystem "Mailgun Email Service" "Sends transactional emails (order confirmations, password resets, notifications)" {
            tags "External System"
        }
        
        # Main E-commerce System
        ecommerceSystem = softwareSystem "Multi-Vendor E-commerce Platform" "Allows customers to purchase products from multiple vendors, vendors to manage their shops, and admins to configure the platform" {
            
            # Frontend Container
            reactApp = container "React SPA" "Provides all e-commerce functionality to users via their web browser" "React 18.2, Vite, Zustand" {
                tags "Web Browser"
                
                # Auth Components
                authModule = component "Authentication Module" "Handles user login, registration, password reset" "React Components"
                
                # Shop Components
                shopModule = component "Shop Module" "Product browsing, search, cart, checkout, payment" "React Components"
                productListView = component "Product List View" "Displays products with filtering and pagination" "React Component"
                productDetailView = component "Product Detail View" "Shows product details, reviews, Q&A" "React Component"
                cartView = component "Cart View" "Shopping cart management" "React Component"
                checkoutView = component "Checkout View" "Order checkout and payment processing" "React Component"
                
                # Customer Components
                customerModule = component "Customer Module" "Customer dashboard, orders, wishlist, notifications" "React Components"
                orderHistoryView = component "Order History View" "View past orders and track shipments" "React Component"
                wishlistView = component "Wishlist View" "Manage saved products" "React Component"
                
                # Vendor Components
                vendorModule = component "Vendor Module" "Vendor dashboard, products, orders, analytics" "React Components"
                vendorDashboard = component "Vendor Dashboard" "Analytics and revenue charts" "React Component + Chart.js"
                productManagement = component "Product Management" "Add/edit products with CKEditor" "React Component + CKEditor"
                vendorOrders = component "Vendor Orders" "Manage orders and fulfillment" "React Component"
                
                # State Management
                authStore = component "Auth Store" "Global authentication state management" "Zustand Store"
                cartContext = component "Cart Context" "Cart count and state" "React Context"
                
                # Utilities
                apiClient = component "API Client" "Axios instance for HTTP requests" "Axios"
                tokenManager = component "Token Manager" "JWT token decode and management" "js-cookie, jwt-decode"
                cartSessionManager = component "Cart Session Manager" "Generates and manages cart session IDs" "LocalStorage"
            }
            
            # Backend API Container
            djangoAPI = container "Django REST API" "Provides e-commerce business logic and data access via RESTful API" "Django 4.2.7, DRF, Python 3.11" {
                tags "API Server"
                
                # API Gateway
                apiRouter = component "API Router" "Routes all API requests to appropriate apps" "Django URLs"
                
                # Authentication App
                userauthsApp = component "User Authentication App" "User registration, login, JWT auth, password reset" "Django App"
                userModel = component "User Model" "Custom user with email auth, OTP, reset tokens" "Django Model"
                profileModel = component "Profile Model" "User profile with bio, address, preferences" "Django Model"
                authViews = component "Auth Views" "JWT token, register, password reset endpoints" "DRF ViewSets"
                
                # Store App (Core E-commerce)
                storeApp = component "Store App" "Core e-commerce logic: products, cart, orders, reviews" "Django App"
                productModel = component "Product Model" "Product with 40+ fields: pricing, stock, variants, flags" "Django Model"
                categoryModel = component "Category Model" "Product categories with image and slug" "Django Model"
                tagModel = component "Tag Model" "Tags linked to categories" "Django Model"
                brandModel = component "Brand Model" "Product brands with image" "Django Model"
                galleryModel = component "Gallery Model" "Product images (many-to-many)" "Django Model"
                specificationModel = component "Specification Model" "Product specifications" "Django Model"
                sizeModel = component "Size Model" "Product size variations with pricing" "Django Model"
                colorModel = component "Color Model" "Product color variations with images" "Django Model"
                cartModel = component "Cart Model" "Shopping cart items with session-based cart_id" "Django Model"
                orderModel = component "CartOrder Model" "Order header with payment/order status" "Django Model"
                orderItemModel = component "CartOrderItem Model" "Order line items with delivery tracking" "Django Model"
                reviewModel = component "Review Model" "Product reviews with 1-5 star ratings" "Django Model"
                wishlistModel = component "Wishlist Model" "User wishlists" "Django Model"
                addressModel = component "Address Model" "User shipping addresses" "Django Model"
                couponModel = component "Coupon Model" "Percentage-based discount coupons" "Django Model"
                couponUsersModel = component "CouponUsers Model" "Tracks coupon usage" "Django Model"
                notificationModel = component "Notification Model" "User/vendor notifications" "Django Model"
                cancelledOrderModel = component "CancelledOrder Model" "Order cancellation tracking" "Django Model"
                deliveryCouriersModel = component "DeliveryCouriers Model" "Delivery service providers" "Django Model"
                storeViews = component "Store Views" "40+ endpoints: products, cart, checkout, payment, search" "DRF ViewSets"
                storeSerializers = component "Store Serializers" "JSON serialization for store models" "DRF Serializers"
                
                # Vendor App
                vendorApp = component "Vendor App" "Vendor shop management, analytics, notifications" "Django App"
                vendorModel = component "Vendor Model" "Vendor shop details and verification" "Django Model"
                vendorViews = component "Vendor Views" "Dashboard stats, products, orders, coupons (30+ endpoints)" "DRF ViewSets"
                
                # Customer App
                customerApp = component "Customer App" "Customer-specific features and account management" "Django App"
                customerViews = component "Customer Views" "Order history, wishlist, notifications, settings" "DRF ViewSets"
                
                # Addon/Config App
                addonApp = component "Addon App" "Platform configuration and settings" "Django App"
                configModel = component "Config Settings Model" "Currency, fees, tax, 2FA settings" "Django Model"
                taxModel = component "Tax Model" "Country-based tax rates" "Django Model"
                
                # Notification System
                notificationComponent = component "Notification System" "Automatic notifications for order events" "Django Signals"
                
                # Payment Processing
                paymentProcessor = component "Payment Processor" "Stripe and PayPal integration" "Django Views"
            }
            
            # Database Container
            database = container "SQLite Database" "Stores user accounts, products, orders, reviews, etc." "SQLite 3" {
                tags "Database"
            }
            
            # File Storage Container
            mediaStorage = container "Media Storage" "Stores uploaded images and files" "Filesystem" {
                tags "Storage"
            }
        }
        
        # Relationships - Users to System
        customer -> ecommerceSystem "Browses products, makes purchases, tracks orders"
        vendor -> ecommerceSystem "Manages shop, products, orders, and analytics"
        admin -> ecommerceSystem "Configures platform settings"
        
        # Relationships - System to External Systems
        ecommerceSystem -> stripeSystem "Processes credit card payments"
        ecommerceSystem -> paypalSystem "Processes PayPal payments"
        ecommerceSystem -> mailgunSystem "Sends transactional emails"
        
        # Relationships - Frontend to Backend
        ecommerceSystem.reactApp -> ecommerceSystem.djangoAPI "Makes API calls to" "HTTPS/REST"
        
        # Relationships - Backend to Database
        ecommerceSystem.djangoAPI -> ecommerceSystem.database "Reads from and writes to" "SQLite Protocol"
        ecommerceSystem.djangoAPI -> ecommerceSystem.mediaStorage "Stores and retrieves files from" "Filesystem"
        
        # Relationships - Backend to External Systems
        ecommerceSystem.djangoAPI -> stripeSystem "Creates payment sessions" "HTTPS/Stripe API"
        ecommerceSystem.djangoAPI -> paypalSystem "Processes PayPal transactions" "HTTPS/PayPal SDK"
        ecommerceSystem.djangoAPI -> mailgunSystem "Sends emails via" "HTTPS/Mailgun API"
        
        # Component-level Relationships - React App
        ecommerceSystem.reactApp.shopModule -> ecommerceSystem.reactApp.apiClient "Uses"
        ecommerceSystem.reactApp.customerModule -> ecommerceSystem.reactApp.apiClient "Uses"
        ecommerceSystem.reactApp.vendorModule -> ecommerceSystem.reactApp.apiClient "Uses"
        ecommerceSystem.reactApp.authModule -> ecommerceSystem.reactApp.apiClient "Uses"
        
        ecommerceSystem.reactApp.apiClient -> ecommerceSystem.reactApp.tokenManager "Includes JWT tokens from"
        ecommerceSystem.reactApp.authModule -> ecommerceSystem.reactApp.authStore "Updates authentication state"
        ecommerceSystem.reactApp.authModule -> ecommerceSystem.reactApp.tokenManager "Stores/retrieves tokens"
        
        ecommerceSystem.reactApp.shopModule -> ecommerceSystem.reactApp.cartSessionManager "Generates cart session IDs"
        ecommerceSystem.reactApp.shopModule -> ecommerceSystem.reactApp.cartContext "Updates cart count"
        
        ecommerceSystem.reactApp.productListView -> ecommerceSystem.reactApp.shopModule "Part of"
        ecommerceSystem.reactApp.productDetailView -> ecommerceSystem.reactApp.shopModule "Part of"
        ecommerceSystem.reactApp.cartView -> ecommerceSystem.reactApp.shopModule "Part of"
        ecommerceSystem.reactApp.checkoutView -> ecommerceSystem.reactApp.shopModule "Part of"
        
        ecommerceSystem.reactApp.orderHistoryView -> ecommerceSystem.reactApp.customerModule "Part of"
        ecommerceSystem.reactApp.wishlistView -> ecommerceSystem.reactApp.customerModule "Part of"
        
        ecommerceSystem.reactApp.vendorDashboard -> ecommerceSystem.reactApp.vendorModule "Part of"
        ecommerceSystem.reactApp.productManagement -> ecommerceSystem.reactApp.vendorModule "Part of"
        ecommerceSystem.reactApp.vendorOrders -> ecommerceSystem.reactApp.vendorModule "Part of"
        
        # Component-level Relationships - Django API
        ecommerceSystem.djangoAPI.apiRouter -> ecommerceSystem.djangoAPI.userauthsApp "Routes auth requests to"
        ecommerceSystem.djangoAPI.apiRouter -> ecommerceSystem.djangoAPI.storeApp "Routes store requests to"
        ecommerceSystem.djangoAPI.apiRouter -> ecommerceSystem.djangoAPI.vendorApp "Routes vendor requests to"
        ecommerceSystem.djangoAPI.apiRouter -> ecommerceSystem.djangoAPI.customerApp "Routes customer requests to"
        
        ecommerceSystem.djangoAPI.authViews -> ecommerceSystem.djangoAPI.userModel "Uses"
        ecommerceSystem.djangoAPI.authViews -> ecommerceSystem.djangoAPI.profileModel "Uses"
        
                ecommerceSystem.djangoAPI.storeViews -> ecommerceSystem.djangoAPI.storeSerializers "Uses"
        ecommerceSystem.djangoAPI.storeViews -> ecommerceSystem.djangoAPI.productModel "Queries"
        ecommerceSystem.djangoAPI.storeViews -> ecommerceSystem.djangoAPI.categoryModel "Queries"
        ecommerceSystem.djangoAPI.storeViews -> ecommerceSystem.djangoAPI.brandModel "Queries"
        ecommerceSystem.djangoAPI.storeViews -> ecommerceSystem.djangoAPI.cartModel "Queries"
        ecommerceSystem.djangoAPI.storeViews -> ecommerceSystem.djangoAPI.orderModel "Queries"
        ecommerceSystem.djangoAPI.storeViews -> ecommerceSystem.djangoAPI.orderItemModel "Queries"
        ecommerceSystem.djangoAPI.storeViews -> ecommerceSystem.djangoAPI.reviewModel "Queries"
        ecommerceSystem.djangoAPI.storeViews -> ecommerceSystem.djangoAPI.wishlistModel "Queries"
        ecommerceSystem.djangoAPI.storeViews -> ecommerceSystem.djangoAPI.couponModel "Queries"
        
        ecommerceSystem.djangoAPI.vendorViews -> ecommerceSystem.djangoAPI.vendorModel "Queries"
        ecommerceSystem.djangoAPI.vendorViews -> ecommerceSystem.djangoAPI.productModel "Queries"
        ecommerceSystem.djangoAPI.vendorViews -> ecommerceSystem.djangoAPI.orderModel "Queries"
        ecommerceSystem.djangoAPI.vendorViews -> ecommerceSystem.djangoAPI.orderItemModel "Queries"
        ecommerceSystem.djangoAPI.vendorViews -> ecommerceSystem.djangoAPI.couponModel "Queries"
        ecommerceSystem.djangoAPI.vendorViews -> ecommerceSystem.djangoAPI.notificationModel "Queries"
        ecommerceSystem.djangoAPI.vendorViews -> ecommerceSystem.djangoAPI.deliveryCouriersModel "Queries"
        
        ecommerceSystem.djangoAPI.customerViews -> ecommerceSystem.djangoAPI.orderModel "Queries"
        ecommerceSystem.djangoAPI.customerViews -> ecommerceSystem.djangoAPI.wishlistModel "Queries"
        ecommerceSystem.djangoAPI.customerViews -> ecommerceSystem.djangoAPI.notificationModel "Queries"
        ecommerceSystem.djangoAPI.customerViews -> ecommerceSystem.djangoAPI.addressModel "Queries"
        
        ecommerceSystem.djangoAPI.notificationComponent -> ecommerceSystem.djangoAPI.notificationModel "Creates notifications"
        ecommerceSystem.djangoAPI.storeViews -> ecommerceSystem.djangoAPI.notificationComponent "Triggers on order events"
        
        ecommerceSystem.djangoAPI.paymentProcessor -> stripeSystem "Integrates with"
        ecommerceSystem.djangoAPI.paymentProcessor -> paypalSystem "Integrates with"
        ecommerceSystem.djangoAPI.storeViews -> ecommerceSystem.djangoAPI.paymentProcessor "Uses"
        
        # Frontend Component to Backend API
        ecommerceSystem.reactApp.apiClient -> ecommerceSystem.djangoAPI.apiRouter "Makes HTTP requests to" "HTTPS/REST"
        
        ecommerceSystem.reactApp.authModule -> ecommerceSystem.djangoAPI.authViews "Calls authentication endpoints"
        ecommerceSystem.reactApp.shopModule -> ecommerceSystem.djangoAPI.storeViews "Calls store endpoints"
        ecommerceSystem.reactApp.customerModule -> ecommerceSystem.djangoAPI.customerViews "Calls customer endpoints"
        ecommerceSystem.reactApp.vendorModule -> ecommerceSystem.djangoAPI.vendorViews "Calls vendor endpoints"
    }

    views {
        # System Context Diagram - Highest Level
        systemContext ecommerceSystem "SystemContext" {
            include *
            autoLayout lr
            description "System context diagram showing the multi-vendor e-commerce platform and its external dependencies"
        }
        
        # Container Diagram - Applications/Services
        container ecommerceSystem "Containers" {
            include *
            autoLayout lr
            description "Container diagram showing the major applications and data stores that make up the e-commerce platform"
        }
        
        # Component Diagram - React Frontend
        component ecommerceSystem.reactApp "FrontendComponents" {
            include *
            autoLayout lr
            description "Component diagram showing the structure of the React single-page application"
        }
        
        # Component Diagram - Django Backend
        component ecommerceSystem.djangoAPI "BackendComponents" {
            include *
            autoLayout tb
            description "Component diagram showing the Django apps and their internal structure"
        }
        
        # Dynamic Diagram - Order Flow
        # Note: Dynamic diagrams show sequences of interactions
        # Commented out for now - can be enabled after adding all required relationships in the model
        # dynamic ecommerceSystem "OrderFlow" "Order processing flow from cart to payment" {
        #     customer -> ecommerceSystem "1. Browses and shops"
        #     ecommerceSystem -> stripeSystem "2. Processes payment"
        #     ecommerceSystem -> mailgunSystem "3. Sends confirmation"
        #     autoLayout lr
        # }
        
        # Styling
        styles {
            element "Element" {
                color #ffffff
            }
            element "Person" {
                background #08427b
                shape person
                color #ffffff
            }
            element "Software System" {
                background #1168bd
                color #ffffff
            }
            element "External System" {
                background #999999
                color #ffffff
            }
            element "Web Browser" {
                background #438dd5
                color #ffffff
            }
            element "API Server" {
                background #438dd5
                color #ffffff
            }
            element "Database" {
                shape cylinder
                background #438dd5
                color #ffffff
            }
            element "Storage" {
                background #438dd5
                color #ffffff
            }
            element "Container" {
                background #438dd5
                color #ffffff
            }
            element "Component" {
                background #85bbf0
                color #000000
            }
        }
        
        theme default
    }

    configuration {
        scope softwaresystem
    }

}
