import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import LocationService from '@/lib/location.service';
import { getStores } from '@/lib/appwrite';
import { Store } from '@/type';
import { images } from '@/constants';
import CustomButton from '@/components/CustomButton';

interface StoreWithDistance extends Store {
  distance?: number;
}

export default function StoresScreen() {
  const [stores, setStores] = useState<StoreWithDistance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedRadius, setSelectedRadius] = useState(10); // km

  useEffect(() => {
    loadStoresAndLocation();
  }, []);

  const loadStoresAndLocation = async () => {
    setIsLoading(true);
    
    try {
      // Get user location
      const location = await LocationService.getCurrentLocation();
      
      if (location) {
        setUserLocation(location);
        
        // Get stores from database
        const storesData = await getStores() as Store[];
        
        // Calculate distances and sort
        const storesWithDistance = LocationService.sortStoresByDistance(
          storesData.map(store => ({
            ...store,
            latitude: store.latitude,
            longitude: store.longitude
          })),
          location
        );
        
        setStores(storesWithDistance as StoreWithDistance[]);
      } else {
        // If location not available, just show stores without distance
        const storesData = await getStores() as Store[];
        setStores(storesData);
      }
    } catch (error) {
      console.error('Error loading stores:', error);
      Alert.alert('Error', 'Failed to load stores');
    } finally {
      setIsLoading(false);
    }
  };

  const openInMaps = (store: Store) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${store.latitude},${store.longitude}`;
    Linking.openURL(url);
  };

  const callStore = (phone?: string) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const filterByRadius = (radiusKm: number) => {
    setSelectedRadius(radiusKm);
    
    if (userLocation && stores.length > 0) {
      const filtered = LocationService.filterStoresByRadius(
        stores,
        userLocation,
        radiusKm
      );
      setStores(filtered as StoreWithDistance[]);
    }
  };

  const handleStorePress = (store: StoreWithDistance) => {
    // Navigate to search/menu screen when store is tapped
    router.push('/search');
  };

  const renderStore = ({ item }: { item: StoreWithDistance }) => (
    <TouchableOpacity 
      onPress={() => handleStorePress(item)}
      activeOpacity={0.8}
      className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100"
    >
      <View className="flex-between flex-row mb-3">
        <View className="flex-1">
          <Text className="h3-bold text-dark-100 mb-1">{item.name}</Text>
          {item.rating && (
            <View className="flex-row items-center gap-1">
              <Image source={images.arrowRight} className="size-4" tintColor="#FFA500" />
              <Text className="small-semibold text-gray-200">{item.rating.toFixed(1)}</Text>
            </View>
          )}
        </View>
        
        {item.distance !== undefined && (
          <View className="bg-primary-50 rounded-full px-3 py-1">
            <Text className="small-bold text-primary">{item.distance.toFixed(1)} km</Text>
          </View>
        )}
      </View>

      <View className="gap-2 mb-4">
        <View className="flex-row items-start gap-2">
          <Image source={images.person} className="size-4 mt-1" tintColor="#5D5F6D" />
          <Text className="base-regular text-gray-200 flex-1">{item.address}</Text>
        </View>
        
        {item.phone && (
          <View className="flex-row items-center gap-2">
            <Image source={images.bag} className="size-4" tintColor="#5D5F6D" />
            <Text className="base-regular text-gray-200">{item.phone}</Text>
          </View>
        )}
        
        {item.openingHours && (
          <View className="flex-row items-center gap-2">
            <Image source={images.home} className="size-4" tintColor="#5D5F6D" />
            <Text className="base-regular text-gray-200">{item.openingHours}</Text>
          </View>
        )}
      </View>

      <View className="flex-row gap-2">
        <TouchableOpacity 
          onPress={() => openInMaps(item)}
          className="flex-1 bg-primary rounded-lg py-3 flex-center"
        >
          <Text className="base-semibold text-white">Get Directions</Text>
        </TouchableOpacity>
        
        {item.phone && (
          <TouchableOpacity 
            onPress={() => callStore(item.phone)}
            className="bg-primary-50 rounded-lg px-4 py-3 flex-center"
          >
            <Image source={images.phone} className="size-5" tintColor="#FE8C00" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white flex-center">
        <ActivityIndicator size="large" color="#FE8C00" />
        <Text className="base-regular text-gray-200 mt-4">Loading nearby stores...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-5 py-4 border-b border-gray-100">
        <Text className="h1-bold text-dark-100 mb-4">Nearby Stores</Text>
        
        {userLocation && (
          <View>
            <Text className="small-semibold text-gray-200 mb-2">Filter by distance</Text>
            <View className="flex-row gap-2">
              {[5, 10, 20, 50].map((radius) => (
                <TouchableOpacity
                  key={radius}
                  onPress={() => filterByRadius(radius)}
                  className={`rounded-full px-4 py-2 ${
                    selectedRadius === radius ? 'bg-primary' : 'bg-gray-100'
                  }`}
                >
                  <Text className={`small-semibold ${
                    selectedRadius === radius ? 'text-white' : 'text-gray-200'
                  }`}>
                    {radius} km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      <FlatList
        data={stores}
        renderItem={renderStore}
        keyExtractor={(item) => item.$id}
        contentContainerClassName="p-5 pb-28"
        ListEmptyComponent={() => (
          <View className="flex-center py-10">
            <Image source={images.logo} className="size-32 opacity-30 mb-4" />
            <Text className="h3-bold text-dark-100 mb-2">No stores found</Text>
            <Text className="base-regular text-gray-200 text-center mb-6">
              Try increasing the search radius or check your location settings
            </Text>
            <CustomButton
              title="Refresh"
              onPress={loadStoresAndLocation}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
