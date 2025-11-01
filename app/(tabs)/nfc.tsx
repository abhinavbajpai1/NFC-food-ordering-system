import React, { useState } from 'react';
import { View, Text, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NFCScanner from '@/components/NFCScanner';
import { MenuItem } from '@/type';
import { NFCMenuData } from '@/lib/nfc.service';
import { useCartStore } from '@/store/cart.store';
import { router } from 'expo-router';

export default function NFCScreen() {
  const { addItem } = useCartStore();

  const handleMenuItemScanned = (menuItem: MenuItem, nfcData: NFCMenuData) => {
    // Add item to cart
    addItem({
      id: menuItem.$id,
      name: menuItem.name,
      price: menuItem.price,
      image_url: menuItem.image_url,
    });

    Alert.alert(
      'Item Added!',
      `${menuItem.name} has been added to your cart`,
      [
        { text: 'Continue Scanning', style: 'cancel' },
        { 
          text: 'View Cart', 
          onPress: () => router.push('/cart')
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-5 justify-center">
        <NFCScanner onMenuItemScanned={handleMenuItemScanned} />
      </View>
    </SafeAreaView>
  );
}
