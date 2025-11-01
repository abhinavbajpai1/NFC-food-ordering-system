import * as Location from 'expo-location';
import { Alert } from 'react-native';

export interface StoreLocation {
  $id?: string;
  id?: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number; // in kilometers
  rating?: number;
  phone?: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

class LocationService {
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Location permission is required to find nearby stores',
          [{ text: 'OK' }]
        );
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  async getCurrentLocation(): Promise<UserLocation | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Location Error', 'Unable to get your current location');
      return null;
    }
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   * Returns distance in kilometers
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Sort stores by distance from user location
   */
  sortStoresByDistance(
    stores: StoreLocation[],
    userLocation: UserLocation
  ): StoreLocation[] {
    return stores
      .map((store) => ({
        ...store,
        distance: this.calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          store.latitude,
          store.longitude
        ),
      }))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  /**
   * Filter stores within a certain radius (in kilometers)
   */
  filterStoresByRadius(
    stores: StoreLocation[],
    userLocation: UserLocation,
    radiusKm: number = 10
  ): StoreLocation[] {
    return stores
      .map((store) => ({
        ...store,
        distance: this.calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          store.latitude,
          store.longitude
        ),
      }))
      .filter((store) => (store.distance || 0) <= radiusKm)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  /**
   * Get address from coordinates (Reverse Geocoding)
   */
  async getAddressFromCoordinates(
    latitude: number,
    longitude: number
  ): Promise<string | null> {
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        return `${address.street || ''}, ${address.city || ''}, ${address.region || ''} ${address.postalCode || ''}`.trim();
      }

      return null;
    } catch (error) {
      console.error('Error getting address:', error);
      return null;
    }
  }
}

export default new LocationService();
