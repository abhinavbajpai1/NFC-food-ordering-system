import {Account, Avatars, Client, Databases, ID, Query, Storage} from "react-native-appwrite";
import {CreateUserPrams, GetMenuParams, SignInParams} from "@/type";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    platform: "com.TAP2EAT.tap2eat",
    databaseId: '6905a5830003bae46cbb',
    bucketId: '6905b0160017ad492404',
    userCollectionId: 'user',
    categoriesCollectionId: 'categories',
    menuCollectionId: 'menu',
    customizationsCollectionId: 'cuustomizations',
    menuCustomizationsCollectionId: 'menucustomization',
    storesCollectionId: 'stores'
}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint!)
    .setProject(appwriteConfig.projectId!)
    .setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);

export const createUser = async ({ email, password, name }: CreateUserPrams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name)
        if(!newAccount) throw Error;

        await signIn({ email, password });

        const avatarUrl = avatars.getInitialsURL(name);

        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            { email, name, accountId: newAccount.$id, avatar: avatarUrl }
        );
    } catch (e) {
        throw new Error(e as string);
    }
}

export const signIn = async ({ email, password }: SignInParams) => {
    try {
        // Delete any existing session before creating a new one
        try {
            await account.deleteSession('current');
        } catch (error) {
            // Ignore error if no session exists
        }
        
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (e) {
        throw new Error(e as string);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if(!currentAccount) {
            return null;
        }

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser || currentUser.documents.length === 0) {
            return null;
        }

        return currentUser.documents[0];
    } catch (e: any) {
        // Handle AppwriteException for missing scopes (user not authenticated)
        // This happens when user is a guest or doesn't have a valid session
        if (
            e?.code === 401 || 
            e?.type === 'general_unauthorized_scope' ||
            e?.message?.includes('missing scopes') || 
            e?.message?.includes('User (role: guests)') ||
            e?.message?.includes('Unauthorized')
        ) {
            // User is not authenticated, return null instead of throwing
            return null;
        }
        
        // For other errors, log but don't throw to prevent app crashes
        // This allows the app to continue working even if there's an unexpected error
        console.log('getCurrentUser error:', e);
        return null;
    }
}

export const getMenu = async ({ category, query }: GetMenuParams) => {
    try {
        const queries: string[] = [];

        if(category) queries.push(Query.equal('categories', category));
        if(query) queries.push(Query.search('name', query));

        const menus = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            queries,
        )

        return menus.documents;
    } catch (e) {
        throw new Error(e as string);
    }
}

export const getCategories = async () => {
    try {
        const categories = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.categoriesCollectionId,
        )

        return categories.documents;
    } catch (e) {
        throw new Error(e as string);
    }
}

export const getStores = async () => {
    try {
        const stores = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.storesCollectionId,
        )

        return stores.documents;
    } catch (e) {
        throw new Error(e as string);
    }
}

export const getMenuItemById = async (itemId: string) => {
    try {
        const menuItem = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            itemId
        )

        return menuItem;
    } catch (e) {
        throw new Error(e as string);
    }
}
