# GameZone DZ - Algerian Gaming E-Commerce

A professional gaming e-commerce website built with React, TypeScript, and Firebase for an Algerian gaming store.

## Features

### Multi-Language Support
- French and Arabic with full RTL support
- Language switcher in navigation
- All content translated

### User Roles & Authentication
- **Guest**: Browse products, prices hidden, see "Create account to see prices" message
- **User (Activated)**: See prices, add to cart, place orders, credit system
- **Seller**: Manage own products (add, edit, delete)
- **Admin**: Full control - manage users, credits, all products

### Credit System
- Each user starts with 100 credits
- Credit tracking for user behavior
- Admin can adjust credits
- Credit history logging

### E-Commerce Features
- Product catalog with categories
- Search and filter functionality
- Shopping cart with persistent storage
- Cash on delivery checkout
- Order management
- Price visibility based on user status

### Admin Panel
- Create and activate users manually (no public registration)
- Manage user roles and status
- Credit system management
- Product management
- View all orders

### Seller Panel
- Add new products
- Edit own products
- Manage inventory

### Design
- Dark gaming theme (black/dark gray)
- Green and cyan accent colors (Xbox/gaming style)
- Modern card-based UI
- Fully responsive (mobile-first)
- WhatsApp contact button

## Product Categories
- Xbox/PS Controllers
- Gaming Headsets
- USB Cables (Type-C, OTG)
- WiFi Adapters & Range Extenders
- Game Accessories
- Consoles & Games
- Gift Cards

## Setup Instructions

### 1. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password
3. Create a Firestore database
4. Copy your Firebase config
5. Update `.env` file with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 2. Firestore Security Rules

Copy the rules from `firestore.rules` to your Firebase Console:
- Go to Firestore Database > Rules
- Paste the rules and publish

### 3. Firestore Collections

Create these collections in Firestore:
- `users` - User profiles with roles and credits
- `products` - Product catalog
- `orders` - Customer orders
- `credit_logs` - Credit transaction history

### 4. Create First Admin User

1. In Firebase Console > Authentication, create a user
2. In Firestore, create a document in `users` collection with the user's UID:
```json
{
  "email": "admin@example.com",
  "role": "admin",
  "status": "active",
  "credit": 100,
  "createdAt": [current timestamp]
}
```

### 5. Install Dependencies

```bash
npm install
```

### 6. Run Development Server

```bash
npm run dev
```

### 7. Build for Production

```bash
npm run build
```

## User Management

### Creating Users (Admin Only)
1. Login as admin
2. Go to Admin Panel
3. Click "Create Account"
4. Enter email, password, and role
5. User is automatically activated

### User Roles
- **user**: Can browse, see prices, order (when active)
- **seller**: Can manage products + user permissions
- **admin**: Full access to everything

### User Status
- **pending**: Waiting for activation
- **active**: Full access
- **suspended**: Access restricted

## Product Management

### As Admin
- Manage all products
- Add/edit/delete any product

### As Seller
- Add new products
- Edit own products only
- Cannot delete others' products

## Credit System

### How It Works
- Starting credit: 100 points
- Viewing prices: FREE (does not reduce credit)
- Credit decreases for:
  - Abandoned carts
  - Spam behavior
- Credit increases for:
  - Completed orders
- Low credit limits access (no IP blocking)

### Admin Credit Management
- View all user credits
- Adjust credits manually
- View credit history
- Add reason for adjustments

## Security Features

### Authentication
- Manual user creation only (no public signup)
- Firebase Authentication
- Role-based access control
- Protected routes

### Firestore Security Rules
- Read/write restrictions based on role
- Users can only see their own orders
- Sellers can only edit their own products
- Admins have full access

## Technologies Used

- React 18
- TypeScript
- Firebase (Auth + Firestore)
- React Router
- Tailwind CSS
- Lucide React (icons)
- Vite

## Contact & Support

- WhatsApp: +213 123 456 789
- Email: contact@gamezonedz.com
- Location: Algeria

## License

All rights reserved © 2024 GameZone DZ
