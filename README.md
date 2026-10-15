# 🍔 Tap2Eat

**A cross-platform food ordering app: browse, search, add to cart, and order in a few taps.**

![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=flat-square&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![NativeWind](https://img.shields.io/badge/NativeWind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Appwrite](https://img.shields.io/badge/Appwrite-F02E65?style=flat-square&logo=appwrite&logoColor=white)

---

## 📌 About

Tap2Eat is a mobile food delivery app I built to get hands-on with a complete React Native workflow: authentication, a real backend, global state, navigation, and error monitoring. Users sign in with Google, explore dishes by category or keyword, view item details, and manage a cart, all backed by Appwrite for data and file storage.

## ✨ Features

- **Google sign-in**: quick, secure authentication
- **Home**: latest offers, with shortcuts into filtered results
- **Search**: keyword search plus category filters across the full menu
- **Item details**: images, description, and add-to-cart
- **Cart**: review items and see the running total
- **Profile**: manage account details and preferences
- **Backend**: menu data and images served from Appwrite

## 🛠 Tech Stack

| Layer | Tools |
|---|---|
| App framework | React Native, Expo (Expo Router) |
| Language | TypeScript |
| Styling | NativeWind (Tailwind CSS for React Native) |
| Backend | Appwrite (auth, database, storage) |
| State | Zustand |
| Monitoring | Sentry |

## 🚀 Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) and npm
- Expo Go app on your phone (or an Android/iOS emulator)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>

# 2. Install dependencies
npm install
```

### Environment variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
EXPO_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_endpoint
```

Get both values from your [Appwrite](https://appwrite.io/) project dashboard.

### Run

```bash
npx expo start
```

Scan the QR code with Expo Go to open the app on your device.

## 🗂 Project Structure

```
app/          # Screens and routes (Expo Router)
components/   # Reusable UI components
lib/          # Appwrite config and helpers
store/        # Zustand stores
assets/       # Images and fonts
```

> Adjust this section to match your actual folders.

## 🔮 Future Improvements

- Order history and live order tracking
- Payment gateway integration
- Favorites / wishlist
- Restaurant ratings and reviews


## 👤 Author

**Abhinav Bajpai**
[LinkedIn](https://www.linkedin.com/in/abhinav-bajpai23071002176/) · [Portfolio](https://abhinavbajpai1.github.io/PersonalPortfolio/)
