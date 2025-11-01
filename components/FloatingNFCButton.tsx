import React, { useState } from 'react';
import { TouchableOpacity, Image, Modal, View, Text } from 'react-native';
import { images } from '@/constants';
import NFCScanner from './NFCScanner';
import { MenuItem } from '@/type';
import { NFCMenuData } from '@/lib/nfc.service';
import { useCartStore } from '@/store/cart.store';
import { router } from 'expo-router';
import { Alert } from 'react-native';

const FloatingNFCButton: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { addItem } = useCartStore();

  const handleMenuItemScanned = (menuItem: MenuItem, nfcData: NFCMenuData) => {
    // Add item to cart
    addItem({
      id: menuItem.$id,
      name: menuItem.name,
      price: menuItem.price,
      image_url: menuItem.image_url,
    });

    setIsModalVisible(false);

    Alert.alert(
      'Item Added!',
      `${menuItem.name} has been added to your cart`,
      [
        { text: 'OK', style: 'cancel' },
        { 
          text: 'View Cart', 
          onPress: () => router.push('/cart')
        }
      ]
    );
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        className="absolute bottom-32 right-6 bg-primary rounded-full size-16 flex-center shadow-lg"
        style={{
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
        }}
      >
        <Image 
          source={images.search} 
          className="size-7" 
          tintColor="#fff"
        />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-11/12 max-w-md">
            <NFCScanner 
              onMenuItemScanned={handleMenuItemScanned}
              onClose={() => setIsModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default FloatingNFCButton;
