# How to Add Restaurants to Your App

## Quick Fix: Seed Restaurants

If no restaurants are showing, you need to add them to your Appwrite database first.

### Option 1: Run the Seeding Script (Recommended)

1. **Make sure collections exist:**
   - Go to Appwrite Console → Database → Collections
   - Create `stores` collection if it doesn't exist
   - Create/Update `menu` collection and add `storeId` field (String, Optional)

2. **Run the seeding script in your app:**

   Create a temporary screen or button to run this, or run it in the console:

   ```typescript
   import { seedAllRestaurantsAndItems } from '@/lib/seed-stores';
   
   // Run this once
   await seedAllRestaurantsAndItems();
   ```

3. **Or add a temporary button in your app** (in restaurants.tsx or profile.tsx):

   ```typescript
   import { seedAllRestaurantsAndItems } from '@/lib/seed-stores';
   
   // Add a button that runs:
   const handleSeedData = async () => {
     try {
       const result = await seedAllRestaurantsAndItems();
       Alert.alert('Success', `Created ${result?.stores} restaurants and ${result?.menuItems} menu items!`);
       // Reload restaurants
       loadStores();
     } catch (error: any) {
       Alert.alert('Error', error.message);
     }
   };
   ```

### Option 2: Add Manually via Appwrite Console

1. Go to Appwrite Console → Database → Collections → `stores`
2. Click "Add Document"
3. Add a document with these fields:
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
4. Repeat for more restaurants

## Troubleshooting

### "Collection not found" Error
- Make sure the `stores` collection exists in Appwrite
- Check that the collection ID is exactly `stores` (lowercase)
- Verify the database ID in `lib/appwrite.ts` matches your Appwrite database

### "No restaurants showing"
- Check console logs: You should see "Loaded stores: X" where X is the number of restaurants
- Make sure you've run the seeding script
- Check Appwrite console to verify restaurants exist in the `stores` collection
- Check collection permissions (Read: Any)

### Restaurants show but no menu items
- Make sure the `menu` collection has a `storeId` field
- Verify menu items have been created with `storeId` values
- Run `seedAllRestaurantsAndItems()` to create both restaurants and menu items

## Verify It Worked

After seeding:
1. Go to the Restaurants tab
2. You should see 10 restaurants listed
3. Tap a restaurant to see its menu items (10 per restaurant)
