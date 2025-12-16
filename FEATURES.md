# Feature Documentation

## User Experience Features

### 1. Guest Users (Not Logged In)
- Can browse all products
- Can view product categories
- Can search and filter products
- **Cannot see prices** - sees "Create an account to see prices" message
- Cannot add to cart
- Cannot place orders
- Can switch language (French/Arabic)
- Can access WhatsApp contact

### 2. Registered Users (Activated)
- All guest features +
- **Can see product prices**
- Can add products to cart
- Can place orders with cash on delivery
- Can view order history
- Has credit balance (starts at 100)
- Can view credit history
- Shopping cart persists across sessions

### 3. Seller Users
- All activated user features +
- Access to Seller Panel
- Can add new products
- Can edit own products
- Can manage product inventory
- Can delete own products
- Cannot manage other users
- Cannot manage credits

### 4. Admin Users
- All seller features +
- Access to Admin Panel
- **User Management:**
  - Create new users manually
  - Set user roles (user, seller, admin)
  - Activate/suspend user accounts
  - View all users
- **Credit Management:**
  - View all user credits
  - Adjust user credits
  - Add reasons for adjustments
  - Track credit history
- **Product Management:**
  - Manage ALL products
  - Edit any product
  - Delete any product
- **Order Management:**
  - View all orders
  - Update order status

## Technical Features

### Multi-Language System
- **Supported Languages:** French (FR) and Arabic (AR)
- **RTL Support:** Full right-to-left layout for Arabic
- **Language Switcher:** Accessible from navbar
- **Persistent:** Language preference saved to localStorage
- **Coverage:** All UI elements, buttons, labels, and messages

### Authentication & Security
- **Firebase Authentication** for user management
- **No public registration** - accounts created by admin only
- **Role-based access control** with protected routes
- **Session persistence** across page reloads
- **Firestore security rules** enforce data access policies

### Product Catalog
- **Categories:**
  - Controllers (Xbox/PS)
  - Gaming Headsets
  - USB Cables (Type-C, OTG)
  - WiFi Adapters & Range Extenders
  - Game Accessories
  - Consoles & Games
  - Gift Cards

- **Product Information:**
  - Name (French & Arabic)
  - Description (French & Arabic)
  - Price (in Algerian Dinar)
  - Stock quantity
  - Images
  - Category

- **Features:**
  - Real-time search
  - Category filtering
  - Stock status indicators
  - Out of stock handling

### Shopping Cart
- **Persistent Storage:** Cart saved to localStorage
- **Features:**
  - Add/remove items
  - Adjust quantities
  - Stock limit validation
  - Real-time total calculation
  - Price visibility based on user status

### Checkout Process
- **Information Required:**
  - Phone number
  - Delivery address
  - Optional notes
- **Payment:** Cash on Delivery (COD)
- **Order Confirmation:** Instant with order tracking

### Credit System
- **Starting Credit:** 100 points per user
- **Credit Tracking:** All changes logged
- **Admin Control:** Adjust credits with reasons
- **Usage:**
  - Viewing prices: FREE (no credit deduction)
  - Abandoned carts: Credit decrease
  - Spam behavior: Credit decrease
  - Completed orders: Credit increase
  - Low credit: Access limitations

### Admin Panel Features
1. **User Management Tab:**
   - List all users
   - Display user role, status, and credit
   - Create new users
   - Activate/suspend users
   - Adjust user credits
   - View user details

2. **Product Management Tab:**
   - List all products
   - Add new products
   - Edit existing products
   - Delete products
   - View product details
   - Track product creators

### Seller Panel Features
- Add new products (multi-language)
- Edit own products only
- Update stock quantities
- Update prices
- Manage product images
- Delete own products
- Cannot access user management
- Cannot adjust credits

### Order Management
- **User View:**
  - Order history
  - Order status tracking
  - Order details (items, prices, total)
  - Delivery information

- **Admin View:**
  - All orders from all users
  - Order status management
  - Customer information

### Responsive Design
- **Mobile-First Approach**
- **Breakpoints:**
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Mobile Menu:** Hamburger navigation
- **Touch-Friendly:** Large tap targets
- **Optimized Images:** Responsive sizing

### Dark Gaming Theme
- **Primary Colors:**
  - Background: Dark (#050810)
  - Secondary: Dark Gray (#0a0e1a)
  - Cards: Gaming Gray (#1a1f2e)

- **Accent Colors:**
  - Primary: Gaming Green (#00ff41) - Xbox style
  - Secondary: Gaming Cyan (#00d9ff) - Tech style

- **Typography:**
  - White text on dark backgrounds
  - High contrast for readability
  - Gaming-inspired font hierarchy

### UI Components
- **Reusable Components:**
  - Buttons (4 variants: primary, secondary, danger, ghost)
  - Cards with hover effects
  - Input fields with labels and error states
  - Select dropdowns
  - Modal dialogs
  - Navigation bar
  - Footer

- **Animations:**
  - Hover transitions
  - Button interactions
  - Card hover effects
  - Smooth page transitions

### WhatsApp Integration
- **Fixed Contact Button**
- **Always Accessible**
- **Direct Link:** Opens WhatsApp chat
- **Professional Setup**
- **Mobile-Optimized**

## Data Structure

### Firestore Collections

1. **users**
   - Stores user profiles
   - Links to Firebase Auth UID
   - Contains role and status
   - Tracks credit balance

2. **products**
   - Multi-language product data
   - Inventory management
   - Creator tracking
   - Timestamp tracking

3. **orders**
   - Order history
   - Customer information
   - Item details
   - Status tracking
   - Delivery information

4. **credit_logs**
   - Credit transaction history
   - Reason tracking
   - Timestamp logging
   - Admin audit trail

## Performance Optimizations

- **Lazy Loading:** Route-based code splitting
- **Local Storage:** Cart and language persistence
- **Firebase Optimization:** Efficient queries with indexes
- **Image Optimization:** Responsive images
- **CSS Optimization:** Tailwind CSS with PurgeCSS

## Security Measures

1. **Authentication:**
   - Firebase Auth integration
   - Protected routes
   - Role-based access

2. **Firestore Rules:**
   - Read/write restrictions
   - Role-based permissions
   - Data validation

3. **Input Validation:**
   - Client-side validation
   - Type safety with TypeScript
   - Sanitized inputs

4. **No SQL Injection:**
   - Firebase handles queries
   - No raw SQL queries

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancement Ideas

- Email notifications for orders
- Advanced product search with filters
- Product reviews and ratings
- Wishlist functionality
- Order tracking with real-time updates
- Analytics dashboard for admin
- Inventory alerts for sellers
- Bulk product import/export
- Multiple payment methods
- Discount codes and promotions
- Customer chat support
- Product recommendations
- Advanced reporting
