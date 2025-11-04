import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStores, getMenuItemsByStore } from '@/lib/appwrite';
import { Store, MenuItem } from '@/type';
import { images } from '@/constants';
import { seedAllRestaurantsAndItems } from '@/lib/seed-stores';

import MenuCard from '@/components/MenuCard';
import CartButton from '@/components/CartButton';
import CustomButton from '@/components/CustomButton';

export default function RestaurantsScreen() {
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loadingMenu, setLoadingMenu] = useState(false);
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [seeding, setSeeding] = useState(false);

    useEffect(() => {
        loadStores();
    }, []);

    const loadStores = async () => {
        setLoading(true);
        setError(null);
        try {
            const storesData = await getStores() as Store[];
            console.log('Loaded stores:', storesData?.length || 0);
            setStores(storesData || []);
        } catch (err: any) {
            const errorMessage = err?.message || 'Failed to load restaurants';
            console.error('Error loading stores:', err);
            setError(errorMessage);
            Alert.alert(
                'Error Loading Restaurants',
                errorMessage + '\n\nMake sure the "stores" collection exists in your Appwrite database.',
                [
                    { text: 'OK', style: 'default' },
                    { text: 'Retry', onPress: loadStores }
                ]
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSeedData = async () => {
        setSeeding(true);
        try {
            Alert.alert(
                'Seed Sample Data',
                'This will create 10 restaurants and 100 menu items. Continue?',
                [
                    { text: 'Cancel', style: 'cancel', onPress: () => setSeeding(false) },
                    {
                        text: 'Seed',
                        onPress: async () => {
                            try {
                                const result = await seedAllRestaurantsAndItems();
                                Alert.alert(
                                    'Success!',
                                    `Created ${result?.stores || 0} restaurants and ${result?.menuItems || 0} menu items!`,
                                    [{ text: 'OK', onPress: loadStores }]
                                );
                            } catch (err: any) {
                                Alert.alert('Error', err?.message || 'Failed to seed data');
                                setSeeding(false);
                            }
                        }
                    }
                ]
            );
        } catch (err: any) {
            Alert.alert('Error', err?.message || 'Failed to seed data');
        } finally {
            setSeeding(false);
        }
    };

    const handleStorePress = async (store: Store) => {
        setSelectedStore(store);
        setLoadingMenu(true);
        
        try {
            const items = await getMenuItemsByStore(store.$id);
            setMenuItems(items as MenuItem[]);
        } catch (error) {
            console.error('Error loading menu items:', error);
            setMenuItems([]);
        } finally {
            setLoadingMenu(false);
        }
    };

    const renderStore = ({ item }: { item: Store }) => (
        <TouchableOpacity
            onPress={() => handleStorePress(item)}
            className="bg-white rounded-xl p-4 mb-4 shadow-md shadow-black/10"
            activeOpacity={0.7}
        >
            <View className="flex-row items-start">
                <View className="bg-primary/10 rounded-lg size-16 flex-center mr-4">
                    <Image source={images.home} className="size-8" tintColor="#FE8C00" />
                </View>
                <View className="flex-1">
                    <Text className="h3-bold text-dark-100 mb-1">{item.name}</Text>
                    <Text className="body-regular text-gray-200 mb-2" numberOfLines={2}>
                        {item.address}
                    </Text>
                    {item.rating && (
                        <View className="flex-row items-center">
                            <Image source={images.star} className="size-4 mr-1" tintColor="#FFD700" />
                            <Text className="body-medium text-dark-100">{item.rating.toFixed(1)}</Text>
                        </View>
                    )}
                    {item.openingHours && (
                        <View className="flex-row items-center mt-1">
                            <Image source={images.clock} className="size-4 mr-1" tintColor="#878787" />
                            <Text className="body-medium text-gray-200">{item.openingHours}</Text>
                        </View>
                    )}
                </View>
                <Image source={images.arrowRight} className="size-5" tintColor="#878787" />
            </View>
        </TouchableOpacity>
    );

    const renderMenuItem = ({ item }: { item: MenuItem }) => (
        <MenuCard item={item} />
    );

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-center h-full">
                    <ActivityIndicator size="large" color="#FE8C00" />
                    <Text className="body-medium text-gray-200 mt-4">Loading restaurants...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-5 py-4 border-b border-gray-100">
                <Text className="h1-bold text-dark-100 mb-2">Restaurants</Text>
                <Text className="body-regular text-gray-200">
                    Select a restaurant to view their menu
                </Text>
            </View>

            <FlatList
                data={stores}
                renderItem={renderStore}
                keyExtractor={(item) => item.$id}
                contentContainerClassName="p-5 pb-28"
                ListEmptyComponent={() => (
                    <View className="flex-center py-10 px-5">
                        <Image source={images.logo} className="size-32 opacity-30 mb-4" />
                        <Text className="h3-bold text-dark-100 mb-2">No restaurants found</Text>
                        <Text className="base-regular text-gray-200 text-center mb-6">
                            {error 
                                ? 'There was an error loading restaurants. Please check your Appwrite database setup.'
                                : 'No restaurants are available yet. Tap the button below to add sample restaurants and menu items.'}
                        </Text>
                        {error ? (
                            <TouchableOpacity
                                onPress={loadStores}
                                className="bg-primary rounded-lg px-6 py-3 mt-4"
                            >
                                <Text className="text-white font-semibold">Retry</Text>
                            </TouchableOpacity>
                        ) : (
                            <CustomButton
                                title={seeding ? "Seeding..." : "Add Sample Restaurants"}
                                onPress={handleSeedData}
                                isLoading={seeding}
                            />
                        )}
                    </View>
                )}
                refreshing={loading}
                onRefresh={loadStores}
            />

            {/* Modal for Restaurant Menu */}
            <Modal
                visible={selectedStore !== null}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setSelectedStore(null)}
            >
                <SafeAreaView className="flex-1 bg-white">
                    <View className="px-5 py-4 border-b border-gray-100 flex-row items-center justify-between">
                        <View className="flex-1">
                            <Text className="h1-bold text-dark-100 mb-1">
                                {selectedStore?.name || 'Restaurant Menu'}
                            </Text>
                            <Text className="body-regular text-gray-200" numberOfLines={1}>
                                {selectedStore?.address}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => setSelectedStore(null)}
                            className="bg-gray-100 rounded-full size-10 flex-center ml-4"
                        >
                            <Image source={images.arrowBack} className="size-6" tintColor="#878787" />
                        </TouchableOpacity>
                    </View>

                    {loadingMenu ? (
                        <View className="flex-center h-full">
                            <ActivityIndicator size="large" color="#FE8C00" />
                            <Text className="body-medium text-gray-200 mt-4">Loading menu...</Text>
                        </View>
                    ) : menuItems.length > 0 ? (
                        <FlatList
                            data={menuItems}
                            renderItem={renderMenuItem}
                            keyExtractor={(item) => item.$id}
                            numColumns={2}
                            columnWrapperStyle={{ justifyContent: 'space-between' }}
                            contentContainerClassName="p-5"
                            ListHeaderComponent={
                                <View className="mb-4">
                                    {selectedStore?.rating && (
                                        <View className="flex-row items-center mb-2">
                                            <Image source={images.star} className="size-5 mr-2" tintColor="#FFD700" />
                                            <Text className="base-semibold text-dark-100">
                                                {selectedStore.rating.toFixed(1)} Rating
                                            </Text>
                                        </View>
                                    )}
                                    {selectedStore?.phone && (
                                        <View className="flex-row items-center mb-2">
                                            <Image source={images.phone} className="size-5 mr-2" tintColor="#878787" />
                                            <Text className="body-regular text-gray-200">{selectedStore.phone}</Text>
                                        </View>
                                    )}
                                    {selectedStore?.openingHours && (
                                        <View className="flex-row items-center">
                                            <Image source={images.clock} className="size-5 mr-2" tintColor="#878787" />
                                            <Text className="body-regular text-gray-200">{selectedStore.openingHours}</Text>
                                        </View>
                                    )}
                                    <View className="border-b border-gray-100 my-4" />
                                    <Text className="h3-bold text-dark-100 mb-4">Menu Items</Text>
                                </View>
                            }
                        />
                    ) : (
                        <View className="flex-center h-full px-5">
                            <Image source={images.emptyState} className="size-48 opacity-30 mb-4" />
                            <Text className="h3-bold text-dark-100 mb-2">No menu items available</Text>
                            <Text className="base-regular text-gray-200 text-center">
                                This restaurant hasn't added any items to their menu yet
                            </Text>
                        </View>
                    )}

                    <CartButton />
                </SafeAreaView>
            </Modal>

            <CartButton />
        </SafeAreaView>
    );
}
