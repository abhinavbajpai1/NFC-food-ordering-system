# NFC & Store Locator Features - Setup Guide

## Overview
TAP2EAT now includes two powerful features:
1. **NFC Food Selection** - Scan NFC tags to instantly add menu items to your cart
2. **Nearby Store Locator** - Find restaurants and stores near your current location

## Features Added

### 🔷 NFC Food Selection
- **Quick Scan**: Tap NFC-enabled menu cards or table tags to add items
- **Instant Add to Cart**: Scanned items are automatically added to your cart
- **Floating Action Button**: Quick access NFC scanner from any screen
- **Dedicated NFC Tab**: Full-screen scanning interface

### 📍 Nearby Store Locator
- **Auto-Location Detection**: Automatically finds your current location
- **Distance Calculation**: Shows exact distance to each store
- **Smart Filtering**: Filter stores by radius (5km, 10km, 20km, 50km)
- **Store Details**: View address, phone, ratings, and opening hours
- **Navigation Integration**: Get directions via Google Maps
- **One-Tap Call**: Direct call to store phone numbers

## Installation

### 1. Install Dependencies
The required packages have been installed:
```bash
npm install react-native-nfc-manager expo-location react-native-maps
```

### 2. Configure Permissions

#### Android (AndroidManifest.xml)
Already configured in `app.json`:
- `ACCESS_FINE_LOCATION`
- `ACCESS_COARSE_LOCATION`
- `NFC`

#### iOS (Info.plist)
Already configured in `app.json`:
- `NFCReaderUsageDescription`

### 3. Database Setup (Appwrite)

You need to create a **stores** collection in your Appwrite database with the following attributes:

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| name | String | Yes | Store name |
| address | String | Yes | Full address |
| latitude | Float | Yes | Latitude coordinate |
| longitude | Float | Yes | Longitude coordinate |
| phone | String | No | Contact phone |
| rating | Float | No | Store rating (0-5) |
| openingHours | String | No | e.g., "9AM - 9PM" |

#### Sample Store Data:
```json
{
  "name": "TAP2EAT Downtown",
  "address": "123 Main Street, City Center",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "phone": "+1234567890",
  "rating": 4.5,
  "openingHours": "8:00 AM - 10:00 PM"
}
```

### 4. NFC Tag Setup

#### Creating NFC Tags for Menu Items

**NFC Data Format:**
```json
{
  "menuItemId": "actual_document_id_from_menu_collection",
  "name": "Cheeseburger",
  "price": 12.99,
  "storeId": "store_document_id"
}
```

**Steps to Write NFC Tags:**
1. Use an NFC writing app (e.g., NFC Tools, TagWriter)
2. Write JSON data as **Text/Plain** format
3. Place tags on menu cards, table stands, or product displays

**Alternative - Use Built-in Writer:**
The app includes `NFCService.writeNFCTag()` method for programmatic writing.

## Usage Guide

### For Customers

#### Using NFC Scanner
1. **From Home Screen**: Tap the floating orange button (bottom-right)
2. **From NFC Tab**: Navigate to the NFC tab in bottom navigation
3. Hold your phone near an NFC tag
4. Item is automatically added to cart
5. Choose to continue scanning or view cart

#### Finding Nearby Stores
1. Navigate to **Stores** tab
2. Allow location permission when prompted
3. View stores sorted by distance
4. Filter by radius using the filter chips
5. Tap "Get Directions" to navigate
6. Tap phone icon to call the store

### For Developers

#### NFC Service Usage
```typescript
import NFCService from '@/lib/nfc.service';

// Initialize NFC
await NFCService.initialize();

// Check if NFC is enabled
const isEnabled = await NFCService.checkEnabled();

// Read NFC tag
const menuData = await NFCService.readNFCTag();

// Write to NFC tag
const success = await NFCService.writeNFCTag({
  menuItemId: 'menu_item_123',
  name: 'Pizza Margherita',
  price: 15.99,
  storeId: 'store_456'
});
```

#### Location Service Usage
```typescript
import LocationService from '@/lib/location.service';

// Get current location
const location = await LocationService.getCurrentLocation();

// Calculate distance
const distance = LocationService.calculateDistance(
  lat1, lon1, lat2, lon2
);

// Sort stores by distance
const sortedStores = LocationService.sortStoresByDistance(
  stores, 
  userLocation
);

// Filter by radius
const nearbyStores = LocationService.filterStoresByRadius(
  stores, 
  userLocation, 
  10 // 10km radius
);
```

## File Structure

```
lib/
├── nfc.service.ts           # NFC functionality
├── location.service.ts      # Location & distance calculations
└── appwrite.ts             # Updated with store functions

components/
├── NFCScanner.tsx          # NFC scanning component
└── FloatingNFCButton.tsx   # Floating action button

app/(tabs)/
├── nfc.tsx                 # NFC tab screen
└── stores.tsx              # Stores locator screen
```

## Troubleshooting

### NFC Not Working
- **Check Device**: Not all phones support NFC
- **Enable NFC**: Go to device settings and enable NFC
- **Permission**: Ensure app has NFC permissions
- **Tag Format**: Ensure NFC tags use Text/Plain format

### Location Not Working
- **Permissions**: Grant location permissions in device settings
- **GPS**: Enable GPS/Location services
- **Network**: Some devices need network for GPS assist

### Stores Not Showing
- **Database**: Ensure stores collection exists in Appwrite
- **Data**: Verify stores have valid latitude/longitude
- **Permissions**: Check database read permissions

## Testing

### Test NFC Without Physical Tags
Use an NFC emulator or another phone with NFC to test:
1. Install NFC Tools on another device
2. Write test menu data
3. Test scanning with your app

### Test Location Without Moving
Use mock locations in development:
```typescript
// For testing
const mockLocation = {
  latitude: 40.7128,
  longitude: -74.0060
};
```

## Production Checklist

- [ ] Create stores collection in Appwrite
- [ ] Add store data with valid coordinates
- [ ] Write NFC tags for menu items
- [ ] Test NFC scanning on multiple devices
- [ ] Test location permission flows
- [ ] Configure proper error handling
- [ ] Add analytics for NFC scans
- [ ] Test offline scenarios

## Next Steps

Consider adding:
- **Map View**: Visual map with store markers
- **Store Photos**: Add images to store listings
- **Favorites**: Save favorite stores
- **NFC History**: Track scanned items
- **Promotions**: Store-specific deals via NFC
- **QR Alternative**: QR codes for non-NFC devices

## Support

For issues or questions:
- Check Appwrite console for data
- Verify device NFC capabilities
- Test location permissions in device settings
- Review error logs in development console
