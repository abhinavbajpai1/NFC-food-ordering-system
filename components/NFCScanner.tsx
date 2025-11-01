import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import NFCService, { NFCMenuData } from '@/lib/nfc.service';
import { getMenuItemById } from '@/lib/appwrite';
import { MenuItem } from '@/type';
import { images } from '@/constants';
import CustomButton from './CustomButton';

interface NFCScannerProps {
  onMenuItemScanned?: (menuItem: MenuItem, nfcData: NFCMenuData) => void;
  onClose?: () => void;
}

const NFCScanner: React.FC<NFCScannerProps> = ({ onMenuItemScanned, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isNFCEnabled, setIsNFCEnabled] = useState(false);
  const [scannedItem, setScannedItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    checkNFCStatus();
    
    return () => {
      NFCService.cleanup();
    };
  }, []);

  const checkNFCStatus = async () => {
    const initialized = await NFCService.initialize();
    if (initialized) {
      const enabled = await NFCService.checkEnabled();
      setIsNFCEnabled(enabled);
    }
  };

  const startScan = async () => {
    if (!isNFCEnabled) {
      Alert.alert(
        'NFC Disabled',
        'Please enable NFC in your device settings',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => NFCService.openSettings() }
        ]
      );
      return;
    }

    setIsScanning(true);
    setScannedItem(null);

    try {
      const nfcData = await NFCService.readNFCTag();
      
      if (nfcData) {
        // Fetch the full menu item from database
        const menuItem = await getMenuItemById(nfcData.menuItemId);
        
        if (menuItem) {
          setScannedItem(menuItem as MenuItem);
          onMenuItemScanned?.(menuItem as MenuItem, nfcData);
        } else {
          Alert.alert('Item Not Found', 'The menu item from this NFC tag could not be found');
        }
      }
    } catch (error) {
      console.error('Error during NFC scan:', error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <View className="bg-white rounded-2xl p-6 gap-6">
      <View className="flex-center gap-3">
        <Image 
          source={images.logo} 
          className="size-20" 
          resizeMode="contain"
        />
        <Text className="h2-bold text-dark-100 text-center">
          Scan NFC Tag
        </Text>
        <Text className="paragraph-regular text-gray-200 text-center">
          Place your phone near an NFC tag to quickly add menu items to your cart
        </Text>
      </View>

      {!isNFCEnabled && (
        <View className="bg-red-50 rounded-lg p-4">
          <Text className="small-semibold text-red-600 text-center">
            NFC is disabled. Please enable it to scan tags.
          </Text>
        </View>
      )}

      {scannedItem && (
        <View className="bg-primary-50 rounded-lg p-4 gap-2">
          <Text className="base-semibold text-primary">Scanned Item:</Text>
          <Text className="h3-bold text-dark-100">{scannedItem.name}</Text>
          <Text className="base-regular text-gray-200">{scannedItem.description}</Text>
          <Text className="h3-bold text-primary">${scannedItem.price.toFixed(2)}</Text>
        </View>
      )}

      <View className="gap-3">
        <CustomButton
          title={isScanning ? 'Scanning...' : 'Start Scan'}
          onPress={startScan}
          isLoading={isScanning}
          leftIcon={
            !isScanning && (
              <Image 
                source={images.search} 
                className="size-5" 
                tintColor="#fff"
              />
            )
          }
        />

        {onClose && (
          <TouchableOpacity 
            onPress={onClose}
            className="py-3 rounded-lg bg-gray-100"
          >
            <Text className="base-semibold text-dark-100 text-center">
              Close
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {isScanning && (
        <View className="absolute inset-0 bg-white/90 rounded-2xl flex-center">
          <View className="flex-center gap-4">
            <ActivityIndicator size="large" color="#FE8C00" />
            <Text className="base-semibold text-dark-100">
              Hold your phone near the NFC tag...
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default NFCScanner;
