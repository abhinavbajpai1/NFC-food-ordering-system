/**
 * Restaurant and Menu Item Seeding Script
 * 
 * This script seeds 10 restaurants and 10 menu items for each restaurant (100 items total)
 * 
 * Usage:
 * 1. Make sure your Appwrite database is set up with:
 *    - 'stores' collection with proper attributes
 *    - 'menu' collection with 'storeId' attribute added
 * 
 * 2. Import and run:
 *    import { seedAllRestaurantsAndItems } from '@/lib/seed-stores';
 *    await seedAllRestaurantsAndItems();
 * 
 * 3. Or run in a React component/function:
 *    useEffect(() => {
 *      seedAllRestaurantsAndItems().then(result => {
 *        console.log('Seeding complete:', result);
 *      });
 *    }, []);
 */

import { seedAllRestaurantsAndItems } from './seed-stores';

/**
 * Run this function to seed all restaurants and menu items
 */
export const runSeed = async () => {
  try {
    console.log('🚀 Starting restaurant and menu item seeding...');
    const result = await seedAllRestaurantsAndItems();
    
    if (result) {
      console.log('\n✨ Successfully seeded:');
      console.log(`   📍 ${result.stores} restaurants`);
      console.log(`   🍔 ${result.menuItems} menu items`);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
};

// Export the main seeding function for direct use
export { seedAllRestaurantsAndItems } from './seed-stores';
