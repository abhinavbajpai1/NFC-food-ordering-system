import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { images } from '@/constants';

const FeaturesBanner: React.FC = () => {
  return (
    <View className="px-5 pb-5">
      <Text className="h2-bold text-dark-100 mb-3">New Features</Text>
      
      <View className="gap-3">
        {/* NFC Feature Card */}
        <TouchableOpacity
          onPress={() => router.push('/nfc')}
          className="bg-primary rounded-xl p-4 flex-row items-center"
          activeOpacity={0.7}
        >
          <View className="bg-white/20 rounded-full size-12 flex-center mr-4">
            <Image 
              source={images.search} 
              className="size-6" 
              tintColor="#fff"
            />
          </View>
          <View className="flex-1">
            <Text className="base-bold text-white mb-1">NFC Quick Order</Text>
            <Text className="small-regular text-white/80">
              Tap menu tags to instantly add items
            </Text>
          </View>
          <Image 
            source={images.arrowRight} 
            className="size-5" 
            tintColor="#fff"
          />
        </TouchableOpacity>

        {/* Store Locator Card */}
        <TouchableOpacity
          onPress={() => router.push('/stores')}
          className="bg-white rounded-xl p-4 flex-row items-center border-2 border-primary"
          activeOpacity={0.7}
        >
          <View className="bg-primary/10 rounded-full size-12 flex-center mr-4">
            <Image 
              source={images.home} 
              className="size-6" 
              tintColor="#FE8C00"
            />
          </View>
          <View className="flex-1">
            <Text className="base-bold text-dark-100 mb-1">Find Nearby Stores</Text>
            <Text className="small-regular text-gray-200">
              Locate restaurants near you
            </Text>
          </View>
          <Image 
            source={images.arrowRight} 
            className="size-5" 
            tintColor="#FE8C00"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FeaturesBanner;
