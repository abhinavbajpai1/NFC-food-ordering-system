import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
import { Alert, Platform } from 'react-native';

export interface NFCMenuData {
  menuItemId: string;
  name: string;
  price: number;
  storeId?: string;
}

class NFCService {
  private isInitialized = false;
  private isScanning = false;
  private isModuleAvailable: boolean | null = null;

  // Check if NFC module is available (works in EAS/Prebuild/Bare, not in Expo Go)
  private async checkModuleAvailability(): Promise<boolean> {
    if (this.isModuleAvailable !== null) {
      return this.isModuleAvailable;
    }

    try {
      // Check if NfcManager exists and has required methods
      if (!NfcManager || typeof NfcManager.isSupported !== 'function') {
        this.isModuleAvailable = false;
        return false;
      }

      // Try to check if supported - this will fail gracefully if module isn't available
      await NfcManager.isSupported();
      this.isModuleAvailable = true;
      return true;
    } catch (error) {
      // Module not available (e.g., in Expo Go)
      this.isModuleAvailable = false;
      console.log('NFC module not available (likely running in Expo Go):', error);
      return false;
    }
  }

  async initialize() {
    if (this.isInitialized) return true;

    // Check if module is available first
    const moduleAvailable = await this.checkModuleAvailability();
    if (!moduleAvailable) {
      // Silently skip in Expo Go - no error, just return false
      console.log('NFC module not available - skipping initialization (safe for Expo Go)');
      return false;
    }

    try {
      const supported = await NfcManager.isSupported();
      if (!supported) {
        // Only show alert in production builds, not during development
        if (__DEV__) {
          console.log('NFC not supported on this device');
        } else {
          Alert.alert('NFC Not Supported', 'Your device does not support NFC');
        }
        return false;
      }

      await NfcManager.start();
      this.isInitialized = true;
      console.log('NFC initialized successfully');
      return true;
    } catch (error: any) {
      // Handle initialization errors gracefully
      const errorMessage = error?.toString() || '';
      
      // Don't show alerts for module unavailable errors (Expo Go case)
      if (
        errorMessage.includes('Native module') ||
        errorMessage.includes('undefined') ||
        errorMessage.includes('null is not an object')
      ) {
        console.log('NFC module not available - skipping (safe for Expo Go)');
        this.isModuleAvailable = false;
        return false;
      }

      console.error('NFC initialization error:', error);
      // Only show alert in production builds
      if (!__DEV__) {
        Alert.alert('NFC Error', 'Failed to initialize NFC. Please try again.');
      }
      return false;
    }
  }

  async checkEnabled() {
    const moduleAvailable = await this.checkModuleAvailability();
    if (!moduleAvailable) {
      return false;
    }

    try {
      return await NfcManager.isEnabled();
    } catch (error) {
      console.error('Error checking NFC status:', error);
      return false;
    }
  }

  async readNFCTag(timeout: number = 5000): Promise<NFCMenuData | null> {
    const moduleAvailable = await this.checkModuleAvailability();
    if (!moduleAvailable) {
      return null;
    }

    const initialized = await this.initialize();
    if (!initialized) {
      return null;
    }

    try {
      // Request NFC technology with timeout handling
      try {
        const techRequest = NfcManager.requestTechnology(NfcTech.Ndef);
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('NFC scan timeout')), timeout);
        });

        await Promise.race([techRequest, timeoutPromise]);
      } catch (timeoutError: any) {
        // If it's our timeout, throw it; otherwise it might be a cancellation
        if (timeoutError?.message === 'NFC scan timeout') {
          throw timeoutError;
        }
        // For other errors (like cancellation), return null
        return null;
      }
      
      const tag = await NfcManager.getTag();
      
      if (tag?.ndefMessage && tag.ndefMessage.length > 0) {
        const ndefRecord = tag.ndefMessage[0];
        const payload = ndefRecord.payload;

        // Decode the NDEF payload
        const text = Ndef.text.decodePayload(new Uint8Array(payload));
        
        try {
          const menuData: NFCMenuData = JSON.parse(text);
          return menuData;
        } catch (parseError) {
          console.error('Error parsing NFC data:', parseError);
          // Only show alert if not in continuous scan mode
          if (!this.isScanning) {
            Alert.alert('Invalid NFC Tag', 'This tag does not contain valid menu data');
          }
          return null;
        }
      }

      return null;
    } catch (error: any) {
      // Check for timeout - this is expected during continuous scanning
      if (error?.message === 'NFC scan timeout') {
        return null; // Silently return null for timeouts
      }

      const errorString = error?.toString() || '';
      
      // Check for various cancellation/user action errors
      if (
        errorString.includes('cancelled') || 
        errorString.includes('UserCancel') ||
        errorString.includes('userCancel') ||
        error?.code === 'UserCancel'
      ) {
        return null;
      }
      
      // Only log errors, don't show alerts during continuous scanning
      if (!this.isScanning) {
        console.error('NFC read error:', error);
        if (!errorString.includes('timeout')) {
          Alert.alert('NFC Error', 'Failed to read NFC tag. Please try again.');
        }
      }
      
      return null;
    } finally {
      try {
        await NfcManager.cancelTechnologyRequest().catch(() => {
          // Ignore errors during cleanup
        });
      } catch (cleanupError) {
        // Ignore cleanup errors
      }
    }
  }

  // Continuous scanning - automatically detects tags when tapped
  async startContinuousScan(
    onTagDetected: (data: NFCMenuData) => void,
    onError?: (error: Error) => void
  ): Promise<() => void> {
    if (this.isScanning) {
      return () => this.stopContinuousScan();
    }

    const moduleAvailable = await this.checkModuleAvailability();
    if (!moduleAvailable) {
      // Silently return empty function - no error, graceful skip for Expo Go
      console.log('NFC module not available - skipping scan (safe for Expo Go)');
      return () => {};
    }

    const enabled = await this.checkEnabled();
    if (!enabled) {
      onError?.(new Error('NFC is not enabled'));
      return () => {};
    }

    const initialized = await this.initialize();
    if (!initialized) {
      onError?.(new Error('Failed to initialize NFC'));
      return () => {};
    }

    this.isScanning = true;

    const scanLoop = async () => {
      while (this.isScanning) {
        try {
          // Use shorter timeout for continuous scanning (2 seconds)
          const nfcData = await this.readNFCTag(2000);
          if (nfcData) {
            onTagDetected(nfcData);
            // Delay before next scan to prevent immediate re-reading
            await new Promise(resolve => setTimeout(resolve, 1500));
          }
        } catch (error) {
          if (this.isScanning) {
            // Only call onError for non-timeout errors
            const errorMessage = (error as Error)?.message || '';
            if (!errorMessage.includes('timeout')) {
              onError?.(error as Error);
            }
          }
          // Continue scanning even on error
        }
        
        // Small delay between scan attempts to prevent overwhelming the NFC system
        if (this.isScanning) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
    };

    scanLoop();

    return () => this.stopContinuousScan();
  }

  stopContinuousScan() {
    this.isScanning = false;
    // Cancel any pending NFC operations if module is available
    if (this.isModuleAvailable) {
      NfcManager.cancelTechnologyRequest().catch(() => {
        // Ignore errors
      });
    }
  }

  async writeNFCTag(menuData: NFCMenuData): Promise<boolean> {
    const moduleAvailable = await this.checkModuleAvailability();
    if (!moduleAvailable) {
      console.log('NFC module not available - cannot write tag (safe for Expo Go)');
      return false;
    }

    const initialized = await this.initialize();
    if (!initialized) {
      return false;
    }

    try {
      // Request NFC technology for writing
      await NfcManager.requestTechnology(NfcTech.Ndef);

      const bytes = Ndef.encodeMessage([
        Ndef.textRecord(JSON.stringify(menuData))
      ]);

      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
        Alert.alert('Success', 'Menu item written to NFC tag successfully!');
        return true;
      }

      return false;
    } catch (error) {
      console.error('NFC write error:', error);
      Alert.alert('Write Error', 'Failed to write to NFC tag. Please try again.');
      return false;
    } finally {
      await NfcManager.cancelTechnologyRequest();
    }
  }

  async cleanup() {
    try {
      // Stop continuous scanning if active
      if (this.isScanning) {
        this.isScanning = false;
      }
      
      // Only try to cancel if module is available
      const moduleAvailable = await this.checkModuleAvailability();
      if (moduleAvailable) {
        // Cancel any pending NFC operations
        await NfcManager.cancelTechnologyRequest().catch(() => {
          // Ignore cleanup errors
        });
      }
    } catch (error) {
      // Ignore cleanup errors, especially if module isn't available
      console.log('NFC cleanup (module may not be available):', error);
    }
  }

  async openSettings() {
    const moduleAvailable = await this.checkModuleAvailability();
    if (!moduleAvailable) {
      Alert.alert(
        'NFC Not Available',
        'NFC is not available in Expo Go. Please use a development build or production build to access NFC settings.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      if (Platform.OS === 'android') {
        await NfcManager.goToNfcSetting();
      } else {
        Alert.alert(
          'Enable NFC',
          'Please enable NFC in your device settings',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error opening NFC settings:', error);
    }
  }
}

export default new NFCService();
