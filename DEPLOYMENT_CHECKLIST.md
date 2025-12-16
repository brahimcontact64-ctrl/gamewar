# Deployment Checklist

## Pre-Deployment Verification

### 1. Security Measures
- [ ] No public registration page exists (only `/login`)
- [ ] Admin-only user creation is enforced
- [ ] Firestore security rules are deployed and active
- [ ] `.env` file is NOT committed to repository
- [ ] Firebase API keys are configured correctly
- [ ] Test that guests cannot see prices
- [ ] Test that inactive users cannot see prices
- [ ] Test that active users CAN see prices

### 2. Firebase Configuration
- [ ] Firebase project created
- [ ] Email/Password authentication enabled
- [ ] Firestore database created (production mode)
- [ ] Security rules deployed from `firestore.rules`
- [ ] First admin user created and tested

### 3. User Roles Testing
- [ ] Admin can create users
- [ ] Admin can activate/suspend users
- [ ] Admin can adjust credits with logging
- [ ] Seller can add/edit own products only
- [ ] Seller cannot access admin features
- [ ] Users can place orders when active
- [ ] Guests see proper activation messages

### 4. Credit System
- [ ] New users start with 100 credits
- [ ] Viewing products does NOT decrease credit
- [ ] Viewing prices does NOT decrease credit
- [ ] Credit adjustments are logged properly
- [ ] Credit history is visible to users
- [ ] Admin can adjust any user's credit

### 5. Price Visibility
- [ ] Guests see: "Créez un compte activé pour voir les prix"
- [ ] Inactive users see: "Votre compte doit être activé par un administrateur"
- [ ] Active users see actual prices in DA
- [ ] Prices are hidden in ProductCard for non-active
- [ ] Cart is inaccessible to guests and inactive users

### 6. Order System
- [ ] Only active users can place orders
- [ ] Order requires phone and address
- [ ] Order validates stock availability
- [ ] Order is saved with correct status
- [ ] Order history shows correctly
- [ ] Cash on delivery is clearly indicated

### 7. Multi-Language
- [ ] French translations work correctly
- [ ] Arabic translations work correctly
- [ ] RTL layout works for Arabic
- [ ] Language preference persists
- [ ] All UI elements are translated

### 8. Mobile Responsiveness
- [ ] Test on mobile device (< 768px)
- [ ] Navigation menu works on mobile
- [ ] Product cards display correctly
- [ ] Forms are usable on mobile
- [ ] WhatsApp button is accessible

### 9. Performance
- [ ] Build completes without errors
- [ ] No console errors in browser
- [ ] Images load properly
- [ ] Cart persists across sessions
- [ ] Page load time is acceptable

### 10. Content
- [ ] WhatsApp number is updated (+213 123 456 789)
- [ ] Contact email is updated
- [ ] Logo/branding is correct
- [ ] Product categories are appropriate
- [ ] Sample products are added (optional for testing)

---

## Deployment Steps

### Option 1: Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase Hosting
firebase init hosting

# Select your project
# Set public directory to: dist
# Configure as SPA: Yes
# Don't set up automatic builds

# Build the project
npm run build

# Deploy
firebase deploy --only hosting
```

### Option 2: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts:
# Framework: Vite
# Build command: npm run build
# Output directory: dist
```

### Option 3: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy

# For production:
netlify deploy --prod
```

---

## Post-Deployment Verification

### 1. Immediate Tests
- [ ] Site loads correctly
- [ ] Login page is accessible
- [ ] Cannot access restricted pages without auth
- [ ] Admin can login
- [ ] Products display correctly
- [ ] Language switcher works

### 2. Security Tests
- [ ] Try to access `/admin` without login → redirected
- [ ] Try to access `/cart` without login → redirected
- [ ] Verify Firestore rules in Firebase Console
- [ ] Check that price data is handled correctly
- [ ] Verify order creation requires active status

### 3. Functionality Tests
- [ ] Admin can create a test user
- [ ] Test user receives pending status
- [ ] Admin can activate test user
- [ ] Test user can now see prices
- [ ] Test user can add to cart
- [ ] Test user can place order
- [ ] Order appears in admin panel

### 4. Performance Tests
- [ ] Page load speed < 3 seconds
- [ ] Images load without delay
- [ ] No console errors
- [ ] Mobile performance is acceptable
- [ ] WhatsApp button works

---

## Environment Variables

Ensure these are set in your hosting platform:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**For Firebase Hosting:**
- Add to `.env.production`

**For Vercel:**
- Add in Project Settings → Environment Variables

**For Netlify:**
- Add in Site Settings → Build & Deploy → Environment Variables

---

## Rollback Plan

If issues occur after deployment:

### Firebase Hosting
```bash
firebase hosting:rollback
```

### Vercel
- Go to Deployments
- Find previous working deployment
- Click "Promote to Production"

### Netlify
- Go to Deploys
- Find previous working deploy
- Click "Publish deploy"

---

## Monitoring

### 1. Firebase Console
- Monitor Authentication users
- Check Firestore usage
- Review security rules logs
- Monitor Functions (if implemented)

### 2. Application Monitoring
- Check for JavaScript errors
- Monitor user registrations (admin only)
- Track order creation rate
- Monitor credit adjustments

### 3. User Feedback
- Monitor WhatsApp messages
- Track support requests
- Gather user experience feedback

---

## Maintenance Tasks

### Daily
- [ ] Check for new user requests (if using email)
- [ ] Review orders from previous day
- [ ] Monitor credit system for anomalies

### Weekly
- [ ] Review suspended users
- [ ] Check credit logs for patterns
- [ ] Update product inventory
- [ ] Review Firestore usage and costs

### Monthly
- [ ] Review user roles and access
- [ ] Analyze order trends
- [ ] Update product catalog
- [ ] Review and update pricing

### As Needed
- [ ] Activate new users
- [ ] Adjust user credits
- [ ] Add new products
- [ ] Handle user suspensions
- [ ] Update WhatsApp number or contact info

---

## Troubleshooting

### Users Can't Login
1. Check Firebase Authentication is enabled
2. Verify user exists in Firebase Auth
3. Check user document exists in Firestore
4. Verify status is 'active'

### Prices Not Showing
1. Check user status is 'active'
2. Verify user is authenticated
3. Check browser console for errors
4. Verify Firestore rules are deployed

### Orders Not Creating
1. Check user is active
2. Verify cart has items
3. Check phone and address are provided
4. Review Firestore security rules
5. Check browser console for errors

### Admin Panel Not Accessible
1. Verify user role is 'admin'
2. Check user status is 'active'
3. Verify authentication is working
4. Clear browser cache and retry

---

## Support Contacts

**Technical Support:**
- Email: support@gamezonedz.com

**Security Issues:**
- Email: security@gamezonedz.com

**Firebase Support:**
- [Firebase Console](https://console.firebase.google.com)
- [Firebase Documentation](https://firebase.google.com/docs)

---

## Success Criteria

Deployment is successful when:
- ✅ Site is accessible at production URL
- ✅ Admin can login and create users
- ✅ New users require activation to see prices
- ✅ Active users can place orders
- ✅ Orders are saved to Firestore
- ✅ Credit system is functioning
- ✅ No console errors
- ✅ Mobile version works
- ✅ Multi-language works
- ✅ Security rules are enforced

---

## Next Steps After Deployment

1. **Add Products**: Use Admin or Seller panel to add real products
2. **Create Users**: Add initial customer base
3. **Test Orders**: Place test orders to verify flow
4. **Marketing**: Share WhatsApp link and promote
5. **Monitor**: Watch for issues and user feedback
6. **Iterate**: Improve based on real usage

---

**Deployment Date:** _________________

**Deployed By:** _________________

**Production URL:** _________________

**Notes:** _________________
