import {View, Text, Image, ScrollView, TouchableOpacity, Alert} from 'react-native'
import {SafeAreaView} from "react-native-safe-area-context";
import {router} from "expo-router";
import useAuthStore from "@/store/auth.store";
import {images} from "@/constants";
import {appwriteConfig} from "@/lib/appwrite";
import {account} from "@/lib/appwrite";
import CustomButton from "@/components/CustomButton";

const Profile = () => {
    const { user, fetchAuthenticatedUser } = useAuthStore();

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await account.deleteSession('current');
                            await fetchAuthenticatedUser();
                            router.replace('/sign-in');
                        } catch (error: any) {
                            Alert.alert('Error', error.message);
                        }
                    }
                }
            ]
        );
    };

    if (!user) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-center h-full">
                    <Text className="base-regular text-gray-200">No user data found</Text>
                </View>
            </SafeAreaView>
        );
    }

    const avatarUrl = user.avatar ? `${user.avatar}?project=${appwriteConfig.projectId}` : images.avatar;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1" contentContainerClassName="px-5 py-8">
                {/* Header */}
                <View className="flex-center mb-8">
                    <View className="relative">
                        <Image 
                            source={typeof avatarUrl === 'string' ? { uri: avatarUrl } : avatarUrl}
                            className="profile-avatar"
                            resizeMode="cover"
                        />
                        <TouchableOpacity className="profile-edit">
                            <Image source={images.pencil} className="size-4" tintColor="white" />
                        </TouchableOpacity>
                    </View>
                    <Text className="h1-bold text-dark-100 mt-4">{user.name || 'User'}</Text>
                    <Text className="base-regular text-gray-200 mt-1">{user.email || ''}</Text>
                </View>

                {/* Profile Fields */}
                <View className="mb-6">
                    <View className="profile-field">
                        <View className="profile-field__icon">
                            <Image source={images.person} className="size-6" tintColor="#FE8C00" />
                        </View>
                        <View className="flex-1">
                            <Text className="small-bold text-gray-200 mb-1">Full Name</Text>
                            <Text className="paragraph-semibold text-dark-100">{user.name || 'Not set'}</Text>
                        </View>
                    </View>

                    <View className="profile-field">
                        <View className="profile-field__icon">
                            <Image source={images.envelope} className="size-6" tintColor="#FE8C00" />
                        </View>
                        <View className="flex-1">
                            <Text className="small-bold text-gray-200 mb-1">Email Address</Text>
                            <Text className="paragraph-semibold text-dark-100">{user.email || 'Not set'}</Text>
                        </View>
                    </View>
                </View>

                {/* Logout Button */}
                <View className="mt-8">
                    <CustomButton
                        title="Logout"
                        onPress={handleLogout}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Profile
