/**
 * Sample store data seeding script
 * Run this to populate your stores collection with sample data
 * 
 * Usage: Create stores manually in Appwrite console or use this as reference
 */

import { databases, appwriteConfig } from './appwrite';
import { ID } from 'react-native-appwrite';

export const sampleStores = [
  {
    name: "TAP2EAT Downtown",
    address: "123 Main Street, Downtown, City Center",
    latitude: 40.7128,
    longitude: -74.0060,
    phone: "+1234567890",
    rating: 4.5,
    openingHours: "8:00 AM - 10:00 PM"
  },
  {
    name: "TAP2EAT Westside",
    address: "456 West Avenue, Westside District",
    latitude: 40.7589,
    longitude: -73.9851,
    phone: "+1234567891",
    rating: 4.7,
    openingHours: "9:00 AM - 11:00 PM"
  },
  {
    name: "TAP2EAT Express",
    address: "789 Quick Street, Express Lane",
    latitude: 40.7306,
    longitude: -73.9352,
    phone: "+1234567892",
    rating: 4.3,
    openingHours: "7:00 AM - 9:00 PM"
  },
  {
    name: "TAP2EAT Central Park",
    address: "321 Park Side Road, Near Central Park",
    latitude: 40.7829,
    longitude: -73.9654,
    phone: "+1234567893",
    rating: 4.8,
    openingHours: "10:00 AM - 10:00 PM"
  },
  {
    name: "TAP2EAT Brooklyn",
    address: "654 Brooklyn Avenue, Brooklyn Heights",
    latitude: 40.6782,
    longitude: -73.9442,
    phone: "+1234567894",
    rating: 4.6,
    openingHours: "8:30 AM - 10:30 PM"
  }
];

/**
 * Seed stores into Appwrite database
 * Note: This requires proper permissions setup in Appwrite
 */
export const seedStores = async () => {
  try {
    console.log('Starting store seeding...');
    
    for (const store of sampleStores) {
      try {
        const result = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.storesCollectionId,
          ID.unique(),
          store
        );
        console.log(`✓ Created store: ${store.name}`);
      } catch (error) {
        console.error(`✗ Failed to create store ${store.name}:`, error);
      }
    }
    
    console.log('Store seeding completed!');
    return true;
  } catch (error) {
    console.error('Store seeding failed:', error);
    return false;
  }
};

/**
 * Sample NFC tag data for menu items
 * Use this format when writing to NFC tags
 */
export const sampleNFCData = [
  {
    menuItemId: "REPLACE_WITH_ACTUAL_MENU_ITEM_ID",
    name: "Classic Burger",
    price: 12.99,
    storeId: "REPLACE_WITH_STORE_ID"
  },
  {
    menuItemId: "REPLACE_WITH_ACTUAL_MENU_ITEM_ID",
    name: "Margherita Pizza",
    price: 15.99,
    storeId: "REPLACE_WITH_STORE_ID"
  },
  {
    menuItemId: "REPLACE_WITH_ACTUAL_MENU_ITEM_ID",
    name: "Caesar Salad",
    price: 9.99,
    storeId: "REPLACE_WITH_STORE_ID"
  },
  {
    menuItemId: "REPLACE_WITH_ACTUAL_MENU_ITEM_ID",
    name: "Chicken Wings",
    price: 11.99,
    storeId: "REPLACE_WITH_STORE_ID"
  }
];

/**
 * Instructions for Appwrite Setup:
 * 
 * 1. Create 'stores' collection in your Appwrite database
 * 2. Add the following attributes:
 *    - name (String, Required)
 *    - address (String, Required)  
 *    - latitude (Float, Required)
 *    - longitude (Float, Required)
 *    - phone (String, Optional)
 *    - rating (Float, Optional)
 *    - openingHours (String, Optional)
 * 
 * 3. Set permissions:
 *    - Read: Any
 *    - Create/Update/Delete: Users (or Admin only)
 * 
 * 4. Index recommendations:
 *    - Create index on 'latitude' for faster queries
 *    - Create index on 'longitude' for faster queries
 */
