import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import NFCService, { NFCMenuData } from '@/lib/nfc.service';
import { getMenuItemById } from '@/lib/appwrite';
import { MenuItem } from '@/type';
import { images } from '@/constants';
import CustomButton from './CustomButton';

interface NFCScannerProps {
  onMenuItemScanned?: (menuItem: MenuItem, nfcData: NFCMenuData) => void;
  onClose?: () => void;
  autoStart?: boolean; // New prop to control auto-start
}

const NFCScanner: React.FC<NFCScannerProps> = ({ 
  onMenuItemScanned, 
  onClose,
  autoStart = true // Default to true for automatic scanning
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isNFCEnabled, setIsNFCEnabled] = useState(false);
  const [scannedItem, setScannedItem] = useState<MenuItem | null>(null);
  const stopScanRef = useRef<(() => void) | null>(null);
  const isProcessingRef = useRef(false);
  const isScanningRef = useRef(false);

  const checkNFCStatus = useCallback(async () => {
    const initialized = await NFCService.initialize();
    if (initialized) {
      const enabled = await NFCService.checkEnabled();
      setIsNFCEnabled(enabled);
      
      if (!enabled) {
        Alert.alert(
          'NFC Disabled',
          'Please enable NFC in your device settings to use tap to select',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => NFCService.openSettings() }
          ]
        );
      }
    }
  }, []);

  const handleTagDetected = useCallback(async (nfcData: NFCMenuData) => {
    // Prevent processing multiple tags at once
    if (isProcessingRef.current) {
      return;
    }

    isProcessingRef.current = true;

    try {
      // Fetch the full menu item from database
      const menuItem = await getMenuItemById(nfcData.menuItemId);
      
      if (menuItem) {
        setScannedItem(menuItem as MenuItem);
        onMenuItemScanned?.(menuItem as MenuItem, nfcData);
      } else {
        Alert.alert('Item Not Found', 'The menu item from this NFC tag could not be found');
      }
    } catch (error) {
      console.error('Error fetching menu item:', error);
      Alert.alert('Error', 'Failed to fetch menu item. Please try again.');
    } finally {
      // Reset processing flag after a short delay
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 1500);
    }
  }, [onMenuItemScanned]);

  const startContinuousScan = useCallback(async () => {
    if (isScanningRef.current) {
      return; // Already scanning
    }

    const enabled = await NFCService.checkEnabled();
    if (!enabled) {
      setIsNFCEnabled(false);
      return;
    }
    setIsNFCEnabled(true);
    isScanningRef.current = true;
    setIsScanning(true);
    setScannedItem(null);

    try {
      const stopScan = await NFCService.startContinuousScan(
        handleTagDetected,
        (error) => {
          // Only show errors that aren't user cancellations
          if (!error.message.includes('cancelled') && !error.message.includes('UserCancel')) {
            console.error('NFC scanning error:', error);
          }
        }
      );

      stopScanRef.current = stopScan;
    } catch (error) {
      console.error('Error starting continuous scan:', error);
      isScanningRef.current = false;
      setIsScanning(false);
      Alert.alert('Scan Error', 'Failed to start NFC scanning. Please try again.');
    }
  }, [handleTagDetected]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      await checkNFCStatus();
      
      // Auto-start scanning if enabled
      if (autoStart && mounted) {
        setTimeout(() => {
          if (mounted) {
            startContinuousScan();
          }
        }, 500); // Small delay to ensure NFC is initialized
      }
    };

    init();
    
    return () => {
      mounted = false;
      if (stopScanRef.current) {
        stopScanRef.current();
      }
      NFCService.cleanup();
    };
  }, [autoStart, checkNFCStatus, startContinuousScan]);

  const stopScan = useCallback(() => {
    if (stopScanRef.current) {
      stopScanRef.current();
      stopScanRef.current = null;
    }
    isScanningRef.current = false;
    setIsScanning(false);
    setScannedItem(null);
  }, []);

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

    if (isScanning) {
      stopScan();
    } else {
      startContinuousScan();
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
          title={isScanning ? 'Stop Scanning' : 'Start Scanning'}
          onPress={startScan}
          isLoading={false}
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
        <View className="absolute inset-0 bg-white/95 rounded-2xl flex-center z-10">
          <View className="flex-center gap-4 px-6">
            <ActivityIndicator size="large" color="#FE8C00" />
            <Text className="base-semibold text-dark-100 text-center">
              {autoStart ? 'Tap an NFC tag to select an item...' : 'Hold your phone near the NFC tag...'}
            </Text>
            <Text className="small-regular text-gray-200 text-center mt-2">
              The scanner is ready. Just tap any NFC-enabled menu item or tag.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default NFCScanner;
