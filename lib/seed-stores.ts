/**
 * Sample store data seeding script
 * Run this to populate your stores collection with sample data
 * 
 * Usage: Create stores manually in Appwrite console or use this as reference
 */

import { databases, appwriteConfig, storage } from './appwrite';
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
  },
  {
    name: "TAP2EAT Queens",
    address: "987 Queens Boulevard, Queens Plaza",
    latitude: 40.7282,
    longitude: -73.7949,
    phone: "+1234567895",
    rating: 4.4,
    openingHours: "9:00 AM - 10:00 PM"
  },
  {
    name: "TAP2EAT Manhattan",
    address: "147 Times Square, Manhattan",
    latitude: 40.7580,
    longitude: -73.9855,
    phone: "+1234567896",
    rating: 4.9,
    openingHours: "8:00 AM - 11:00 PM"
  },
  {
    name: "TAP2EAT Bronx",
    address: "258 Bronx Park Avenue, The Bronx",
    latitude: 40.8448,
    longitude: -73.8648,
    phone: "+1234567897",
    rating: 4.5,
    openingHours: "8:00 AM - 9:30 PM"
  },
  {
    name: "TAP2EAT Staten Island",
    address: "369 Staten Island Drive, North Shore",
    latitude: 40.5795,
    longitude: -74.1502,
    phone: "+1234567898",
    rating: 4.6,
    openingHours: "9:00 AM - 10:00 PM"
  },
  {
    name: "TAP2EAT SoHo",
    address: "741 SoHo Street, SoHo District",
    latitude: 40.7231,
    longitude: -74.0026,
    phone: "+1234567899",
    rating: 4.7,
    openingHours: "10:00 AM - 11:00 PM"
  }
];

/**
 * Sample menu items data - will be used for all restaurants
 */
const sampleMenuItems = [
  {
    name: "Classic Cheeseburger",
    description: "Juicy beef patty with melted cheese, fresh lettuce, and tomato",
    price: 12.99,
    rating: 4.5,
    calories: 550,
    protein: 25,
    type: "main",
    image_url: "https://static.vecteezy.com/system/resources/previews/044/844/600/large_2x/homemade-fresh-tasty-burger-with-meat-and-cheese-classic-cheese-burger-and-vegetable-ai-generated-free-png.png"
  },
  {
    name: "Pepperoni Pizza",
    description: "Classic pizza loaded with cheese and pepperoni slices",
    price: 15.99,
    rating: 4.7,
    calories: 700,
    protein: 30,
    type: "main",
    image_url: "https://static.vecteezy.com/system/resources/previews/023/742/417/large_2x/pepperoni-pizza-isolated-illustration-ai-generative-free-png.png"
  },
  {
    name: "Grilled Chicken Sandwich",
    description: "Tender grilled chicken breast with mayo, lettuce, and special sauce",
    price: 11.99,
    rating: 4.4,
    calories: 480,
    protein: 32,
    type: "main",
    image_url: "https://static.vecteezy.com/system/resources/previews/060/364/135/large_2x/a-flavorful-club-sandwich-with-turkey-bacon-and-fresh-vegetables-sliced-and-isolated-on-a-transparent-background-free-png.png"
  },
  {
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with Caesar dressing, croutons, and parmesan",
    price: 9.99,
    rating: 4.3,
    calories: 320,
    protein: 12,
    type: "salad",
    image_url: "https://static.vecteezy.com/system/resources/previews/044/844/600/large_2x/homemade-fresh-tasty-burger-with-meat-and-cheese-classic-cheese-burger-and-vegetable-ai-generated-free-png.png"
  },
  {
    name: "BBQ Chicken Wings",
    description: "Crispy chicken wings tossed in tangy BBQ sauce",
    price: 13.99,
    rating: 4.6,
    calories: 450,
    protein: 28,
    type: "appetizer",
    image_url: "https://static.vecteezy.com/system/resources/previews/044/844/600/large_2x/homemade-fresh-tasty-burger-with-meat-and-cheese-classic-cheese-burger-and-vegetable-ai-generated-free-png.png"
  },
  {
    name: "Fish Tacos",
    description: "Fresh fish fillets in soft tortillas with slaw and lime",
    price: 14.99,
    rating: 4.5,
    calories: 520,
    protein: 22,
    type: "main",
    image_url: "https://static.vecteezy.com/system/resources/previews/055/133/581/large_2x/deliciously-grilled-burritos-filled-with-beans-corn-and-fresh-vegetables-served-with-lime-wedge-and-cilantro-isolated-on-transparent-background-free-png.png"
  },
  {
    name: "Mushroom Risotto",
    description: "Creamy arborio rice with mixed mushrooms and parmesan",
    price: 16.99,
    rating: 4.8,
    calories: 580,
    protein: 18,
    type: "main",
    image_url: "https://static.vecteezy.com/system/resources/previews/023/742/417/large_2x/pepperoni-pizza-isolated-illustration-ai-generative-free-png.png"
  },
  {
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    price: 8.99,
    rating: 4.9,
    calories: 450,
    protein: 6,
    type: "dessert",
    image_url: "https://static.vecteezy.com/system/resources/previews/044/844/600/large_2x/homemade-fresh-tasty-burger-with-meat-and-cheese-classic-cheese-burger-and-vegetable-ai-generated-free-png.png"
  },
  {
    name: "French Fries",
    description: "Crispy golden fries served with ketchup",
    price: 4.99,
    rating: 4.2,
    calories: 280,
    protein: 4,
    type: "side",
    image_url: "https://static.vecteezy.com/system/resources/previews/044/844/600/large_2x/homemade-fresh-tasty-burger-with-meat-and-cheese-classic-cheese-burger-and-vegetable-ai-generated-free-png.png"
  },
  {
    name: "Iced Coffee",
    description: "Chilled coffee with ice, perfect for any time of day",
    price: 3.99,
    rating: 4.4,
    calories: 50,
    protein: 1,
    type: "beverage",
    image_url: "https://static.vecteezy.com/system/resources/previews/044/844/600/large_2x/homemade-fresh-tasty-burger-with-meat-and-cheese-classic-cheese-burger-and-vegetable-ai-generated-free-png.png"
  }
];

/**
 * Upload image to storage (placeholder - returns URL if needed)
 */
async function uploadImageToStorage(imageUrl: string): Promise<string> {
  // For now, return the URL as-is
  // In production, you might want to upload to Appwrite storage
  return imageUrl;
}

/**
 * Check if a collection exists by trying to list documents
 */
async function checkCollectionExists(collectionId: string): Promise<boolean> {
  try {
    await databases.listDocuments(
      appwriteConfig.databaseId,
      collectionId,
      []
    );
    return true;
  } catch (error: any) {
    if (error?.code === 404 || error?.message?.includes('not found') || error?.message?.includes('could not be found')) {
      return false;
    }
    throw error;
  }
}

/**
 * Seed stores into Appwrite database
 * Note: This requires proper permissions setup in Appwrite
 */
export const seedStores = async () => {
  try {
    console.log('Starting store seeding...');
    
    // Check if stores collection exists
    const collectionExists = await checkCollectionExists(appwriteConfig.storesCollectionId);
    if (!collectionExists) {
      throw new Error(
        `❌ Collection "${appwriteConfig.storesCollectionId}" not found!\n\n` +
        `Please create the collection in Appwrite:\n` +
        `1. Go to Appwrite Console → Database → Collections\n` +
        `2. Create a collection with ID: "${appwriteConfig.storesCollectionId}"\n` +
        `3. Add these attributes:\n` +
        `   - name (String, Required)\n` +
        `   - address (String, Required)\n` +
        `   - latitude (Float, Required)\n` +
        `   - longitude (Float, Required)\n` +
        `   - phone (String, Optional)\n` +
        `   - rating (Float, Optional)\n` +
        `   - openingHours (String, Optional)\n`
      );
    }
    
    const createdStores: Array<{ id: string; name: string }> = [];
    
    for (const store of sampleStores) {
      try {
        const result = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.storesCollectionId,
          ID.unique(),
          store
        );
        console.log(`✓ Created store: ${store.name}`);
        createdStores.push({ id: result.$id, name: store.name });
      } catch (error) {
        console.error(`✗ Failed to create store ${store.name}:`, error);
      }
    }
    
    console.log('Store seeding completed!');
    return createdStores;
  } catch (error: any) {
    console.error('Store seeding failed:', error.message || error);
    throw error;
  }
};

/**
 * Seed menu items for a specific store
 */
export const seedMenuItemsForStore = async (storeId: string, storeName: string) => {
  try {
    console.log(`Starting menu item seeding for ${storeName}...`);
    
    // Check if menu collection exists
    const collectionExists = await checkCollectionExists(appwriteConfig.menuCollectionId);
    if (!collectionExists) {
      throw new Error(
        `❌ Collection "${appwriteConfig.menuCollectionId}" not found!\n\n` +
        `Please create the collection in Appwrite:\n` +
        `1. Go to Appwrite Console → Database → Collections\n` +
        `2. Create a collection with ID: "${appwriteConfig.menuCollectionId}"\n` +
        `3. Add these attributes:\n` +
        `   - name (String, Required)\n` +
        `   - description (String, Required)\n` +
        `   - image_url (String, Required)\n` +
        `   - price (Float, Required)\n` +
        `   - rating (Float, Required)\n` +
        `   - calories (Integer, Required)\n` +
        `   - protein (Integer, Required)\n` +
        `   - type (String, Required)\n` +
        `   - storeId (String, Optional) ⚠️ IMPORTANT: Add this field!\n`
      );
    }
    
    let count = 0;
    
    for (const item of sampleMenuItems) {
      try {
        const imageUrl = await uploadImageToStorage(item.image_url);
        
        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.menuCollectionId,
          ID.unique(),
          {
            name: item.name,
            description: item.description,
            image_url: imageUrl,
            price: item.price,
            rating: item.rating,
            calories: item.calories,
            protein: item.protein,
            type: item.type,
            storeId: storeId, // Associate with the store
          }
        );
        count++;
        console.log(`  ✓ Created menu item: ${item.name}`);
      } catch (error: any) {
        console.error(`  ✗ Failed to create menu item ${item.name}:`, error.message || error);
        // Check if it's a storeId field error
        if (error?.message?.includes('storeId') || error?.code === 400) {
          console.error(`    💡 Tip: Make sure the 'storeId' attribute exists in the 'menu' collection!`);
        }
      }
    }
    
    console.log(`✓ Created ${count} menu items for ${storeName}`);
    return count;
  } catch (error: any) {
    console.error(`Menu item seeding failed for ${storeName}:`, error.message || error);
    throw error;
  }
};

/**
 * Seed all stores and their menu items
 */
export const seedAllRestaurantsAndItems = async () => {
  try {
    console.log('🍽️  Starting complete restaurant and menu seeding...\n');
    
    // Step 1: Seed all stores
    const stores = await seedStores();
    
    if (stores.length === 0) {
      console.log('⚠️  No stores were created. Please check your Appwrite configuration.');
      return;
    }
    
    console.log(`\n✓ Created ${stores.length} restaurants\n`);
    
    // Step 2: Seed menu items for each store
    console.log('📝 Starting menu item seeding for all restaurants...\n');
    let totalItems = 0;
    
    for (const store of stores) {
      const count = await seedMenuItemsForStore(store.id, store.name);
      totalItems += count;
      console.log(''); // Empty line for readability
    }
    
    console.log('✅ Seeding completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Restaurants: ${stores.length}`);
    console.log(`   - Menu Items: ${totalItems} (${sampleMenuItems.length} per restaurant)`);
    
    return { stores: stores.length, menuItems: totalItems };
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
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
 * 3. Make sure 'menu' collection has 'storeId' attribute:
 *    - storeId (String, Optional) - to associate menu items with restaurants
 * 
 * 4. Set permissions:
 *    - Read: Any
 *    - Create/Update/Delete: Users (or Admin only)
 * 
 * 5. To run the seeding:
 *    import { seedAllRestaurantsAndItems } from '@/lib/seed-stores';
 *    await seedAllRestaurantsAndItems();
 */
