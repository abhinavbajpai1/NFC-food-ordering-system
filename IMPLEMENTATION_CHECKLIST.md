# Implementation Checklist - NFC & Store Locator

## ✅ Code Implementation (COMPLETED)

- [x] Install NFC and location dependencies
- [x] Create NFC service with read/write capabilities
- [x] Create location service with distance calculations
- [x] Build NFCScanner component
- [x] Build FloatingNFCButton component
- [x] Build FeaturesBanner component
- [x] Create NFC tab screen
- [x] Create Stores locator screen
- [x] Update tab navigation layout
- [x] Add permissions to app.json
- [x] Update Appwrite functions
- [x] Update TypeScript types
- [x] Add features banner to home screen
- [x] Create documentation

## 📋 Database Setup (TODO - Required)

### 1. Create Stores Collection in Appwrite

- [ ] Go to Appwrite Console → Database
- [ ] Create new collection named **"stores"**
- [ ] Add the following attributes:

| Attribute | Type | Size | Required | Default |
|-----------|------|------|----------|---------|
| name | String | 255 | Yes | - |
| address | String | 500 | Yes | - |
| latitude | Float | - | Yes | - |
| longitude | Float | - | Yes | - |
| phone | String | 20 | No | - |
| rating | Float | - | No | 0 |
| openingHours | String | 100 | No | - |

### 2. Set Collection Permissions

- [ ] Read Access: **Any** (or Role: users)
- [ ] Create Access: **Admin only**
- [ ] Update Access: **Admin only**
- [ ] Delete Access: **Admin only**

### 3. Create Indexes (Recommended)

- [ ] Index on `latitude` (ASC)
- [ ] Index on `longitude` (ASC)
- [ ] Index on `rating` (DESC) - for sorting

### 4. Add Sample Store Data

Use the data from `lib/seed-stores.ts` or add manually:

**Store 1:**
```json
{
  "name": "TAP2EAT Downtown",
  "address": "123 Main Street, Downtown, City Center",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "phone": "+1234567890",
  "rating": 4.5,
  "openingHours": "8:00 AM - 10:00 PM"
}
```

- [ ] Add at least 3-5 stores for testing
- [ ] Use real coordinates near your test location
- [ ] Verify stores appear in Appwrite console

## 📱 Physical Setup (TODO - Required)

### NFC Tags

- [ ] Purchase NFC tags (NFC Type 2, NTAG213 recommended)
- [ ] Choose tag placement locations:
  - [ ] Menu cards
  - [ ] Table stands
  - [ ] Product displays
  - [ ] Checkout counter

### NFC Tag Writing

For each menu item you want to enable:

1. [ ] Get the menu item's document ID from Appwrite
2. [ ] Use NFC writing app (NFC Tools, TagWriter)
3. [ ] Write this JSON data as **Text/Plain**:

```json
{
  "menuItemId": "YOUR_MENU_ITEM_DOCUMENT_ID",
  "name": "Item Name",
  "price": 12.99,
  "storeId": "OPTIONAL_STORE_ID"
}
```

4. [ ] Test scan with your app
5. [ ] Label the tag (e.g., "Burger NFC")
6. [ ] Attach to menu/display

**Recommended:** Write 5-10 tags for testing

## 🧪 Testing (TODO - Before Production)

### Device Testing

- [ ] Test on Android device with NFC (Android 4.4+)
- [ ] Test on iPhone with NFC (iOS 13+)
- [ ] Test with NFC disabled
- [ ] Test without location permission

### NFC Testing

- [ ] Scan valid NFC tag
- [ ] Verify item adds to cart
- [ ] Scan invalid/empty tag
- [ ] Test rapid successive scans
- [ ] Test from home screen floating button
- [ ] Test from NFC tab
- [ ] Verify error messages

### Location Testing

- [ ] Grant location permission
- [ ] Deny location permission
- [ ] Test with GPS disabled
- [ ] Verify distance calculations
- [ ] Test radius filters (5km, 10km, 20km, 50km)
- [ ] Test "Get Directions" button
- [ ] Test phone call button
- [ ] Test with no stores nearby

### UI/UX Testing

- [ ] Features banner displays on home
- [ ] Floating NFC button visible
- [ ] Tab navigation works
- [ ] Loading states show properly
- [ ] Error states display correctly
- [ ] Success messages appear

## 🚀 Build & Deploy (TODO - Before Release)

### Pre-build

- [ ] Update app version in app.json
- [ ] Test on development build
- [ ] Verify all permissions work

### Android Build

```bash
eas build --platform android
```

- [ ] Build APK/AAB
- [ ] Test NFC on physical device
- [ ] Test location services
- [ ] Verify permissions prompt

### iOS Build

```bash
eas build --platform ios
```

- [ ] Build IPA
- [ ] Test NFC on iPhone
- [ ] Test location services
- [ ] Verify permissions prompt

### Pre-Release Checklist

- [ ] All features tested
- [ ] Store data populated
- [ ] NFC tags written
- [ ] Documentation reviewed
- [ ] Screenshots updated
- [ ] Store listing updated

## 📖 Documentation (TODO - User Facing)

### Create User Guide

- [ ] How to scan NFC tags
- [ ] How to find stores
- [ ] Troubleshooting NFC issues
- [ ] Enabling location services

### Create Staff Training

- [ ] How NFC ordering works
- [ ] Tag placement guidelines
- [ ] Handling customer issues
- [ ] Tag replacement process

### Update App Store Listings

- [ ] Add "NFC ordering" to description
- [ ] Add "Store locator" to features
- [ ] Update screenshots
- [ ] Add keywords: "NFC, contactless, location"

## 🔧 Configuration (TODO - Production)

### Environment Variables

Verify in `.env`:
```
EXPO_PUBLIC_APPWRITE_ENDPOINT=your_endpoint
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
```

### Appwrite Collection IDs

Update in `lib/appwrite.ts` if needed:
```typescript
storesCollectionId: 'stores' // or your actual ID
```

### Google Maps API (Optional)

For enhanced maps:
- [ ] Get Google Maps API key
- [ ] Add to app.json
- [ ] Configure billing

## 📊 Analytics Setup (TODO - Recommended)

Track usage:
- [ ] NFC scan events
- [ ] Store view events
- [ ] Navigation clicks
- [ ] Failed scans
- [ ] Popular items via NFC

## 🔒 Security (TODO - Production)

- [ ] Verify Appwrite permissions
- [ ] Test unauthorized access
- [ ] Validate NFC data format
- [ ] Sanitize store coordinates
- [ ] Rate limit NFC scans

## 💡 Optional Enhancements

- [ ] Add map view with markers
- [ ] Enable store photos
- [ ] Add favorite stores
- [ ] Track NFC scan history
- [ ] Add QR code fallback
- [ ] Store-specific promotions
- [ ] Offline mode support
- [ ] Push notifications for nearby stores

## ✅ Launch Checklist

Final checks before going live:

- [ ] Database setup complete
- [ ] NFC tags written and placed
- [ ] Location permissions work
- [ ] All features tested
- [ ] App builds successfully
- [ ] Store listings updated
- [ ] User guide created
- [ ] Staff trained
- [ ] Analytics configured
- [ ] Backup plan ready

## 🎉 Post-Launch

- [ ] Monitor NFC scan rates
- [ ] Track store locator usage
- [ ] Collect user feedback
- [ ] Update documentation
- [ ] Add more NFC tags based on usage
- [ ] Optimize store data

---

## 📞 Need Help?

Refer to:
- `NFC_STORES_SETUP.md` - Technical setup guide
- `FEATURES_SUMMARY.md` - Feature overview
- Appwrite documentation
- React Native NFC Manager docs

**Current Status:** Code complete, database setup required
**Next Step:** Create stores collection in Appwrite
