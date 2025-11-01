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

  async initialize() {
    if (this.isInitialized) return true;

    try {
      const supported = await NfcManager.isSupported();
      if (!supported) {
        Alert.alert('NFC Not Supported', 'Your device does not support NFC');
        return false;
      }

      await NfcManager.start();
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('NFC initialization error:', error);
      return false;
    }
  }

  async checkEnabled() {
    try {
      return await NfcManager.isEnabled();
    } catch (error) {
      console.error('Error checking NFC status:', error);
      return false;
    }
  }

  async readNFCTag(): Promise<NFCMenuData | null> {
    try {
      await this.initialize();

      // Request NFC technology
      await NfcManager.requestTechnology(NfcTech.Ndef);

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
          Alert.alert('Invalid NFC Tag', 'This tag does not contain valid menu data');
          return null;
        }
      }

      return null;
    } catch (error: any) {
      console.error('NFC read error:', error);
      
      if (error.toString().includes('cancelled')) {
        // User cancelled, don't show error
        return null;
      }
      
      Alert.alert('NFC Error', 'Failed to read NFC tag. Please try again.');
      return null;
    } finally {
      await NfcManager.cancelTechnologyRequest();
    }
  }

  async writeNFCTag(menuData: NFCMenuData): Promise<boolean> {
    try {
      await this.initialize();

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
      await NfcManager.cancelTechnologyRequest();
    } catch (error) {
      console.error('Error cleaning up NFC:', error);
    }
  }

  async openSettings() {
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
