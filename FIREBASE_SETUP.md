# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "gamezone-dz")
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Go to **Sign-in method** tab
4. Enable **Email/Password**
5. Save

## Step 3: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Choose **Start in production mode**
4. Select a location close to Algeria (e.g., europe-west1)
5. Click "Enable"

## Step 4: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Register your app (e.g., "GameZone DZ Web")
5. Copy the Firebase configuration

## Step 5: Update Environment Variables

Create or update `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

## Step 6: Set Firestore Security Rules

1. Go to **Firestore Database** > **Rules** tab
2. Copy the content from `firestore.rules` in this project
3. Paste it in the Firebase Console
4. Click **Publish**

## Step 7: Create First Admin User

### Via Firebase Console:

1. Go to **Authentication** > **Users**
2. Click "Add user"
3. Enter email: `admin@yourdomain.com`
4. Enter password (min 6 characters)
5. Click "Add user"
6. Copy the User UID

### Add User Document to Firestore:

1. Go to **Firestore Database** > **Data**
2. Click "Start collection"
3. Collection ID: `users`
4. Document ID: [paste the User UID from step 6]
5. Add fields:
   - `email` (string): `admin@yourdomain.com`
   - `role` (string): `admin`
   - `status` (string): `active`
   - `credit` (number): `100`
   - `createdAt` (timestamp): [click "Use current date and time"]
6. Click "Save"

## Step 8: Test the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:5173

3. Click "Login" and sign in with your admin credentials

4. You should see the Admin Panel option in the navigation

## Database Collections Structure

### users
```
{
  uid: string (document ID matches auth UID)
  email: string
  role: "guest" | "user" | "seller" | "admin"
  status: "pending" | "active" | "suspended"
  credit: number (default: 100)
  createdAt: timestamp
  displayName?: string
}
```

### products
```
{
  id: string (auto-generated)
  nameFr: string
  nameAr: string
  descriptionFr: string
  descriptionAr: string
  price: number
  stock: number
  category: string
  images: string[]
  createdBy: string (user UID)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### orders
```
{
  id: string (auto-generated)
  userId: string
  items: array of {
    productId: string
    quantity: number
    price: number
    name: string
  }
  total: number
  status: "pending" | "confirmed" | "delivered" | "cancelled"
  phone: string
  deliveryAddress: string
  notes?: string
  createdAt: timestamp
}
```

### credit_logs
```
{
  id: string (auto-generated)
  userId: string
  amount: number (can be positive or negative)
  type: "purchase" | "abandoned_cart" | "spam" | "admin_adjustment"
  reason: string
  createdAt: timestamp
}
```

## Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use strong passwords** for admin accounts
3. **Regularly review user access** in Firebase Console
4. **Monitor Firestore usage** to avoid unexpected costs
5. **Enable Firebase App Check** for production (optional but recommended)
6. **Set up billing alerts** in Google Cloud Console

## Production Deployment

### Build for Production

```bash
npm run build
```

The production files will be in the `dist/` directory.

### Deploy to Firebase Hosting (Optional)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase Hosting:
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Set public directory to `dist`
   - Configure as single-page app: Yes
   - Set up automatic builds with GitHub: No

4. Deploy:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

## Troubleshooting

### Authentication not working
- Check that Email/Password is enabled in Firebase Console
- Verify `.env` variables are correct
- Make sure to restart the dev server after changing `.env`

### Prices not showing for logged-in users
- Check user document in Firestore has `status: "active"`
- Verify user has the correct role

### Admin panel not accessible
- Ensure user document has `role: "admin"`
- Check Firestore security rules are properly set

### Products not loading
- Verify Firestore security rules allow read access to products
- Check browser console for errors
- Ensure products collection exists in Firestore

## Support

For issues or questions:
- Check the README.md file
- Review Firebase documentation: https://firebase.google.com/docs
- Contact: contact@gamezonedz.com
