# Kundali AI V2 Source Code

![image](https://github.com/user-attachments/assets/32224070-a333-42d4-84bd-0674daee358a)


## Prerequisites

- Node.js
- bun (`npm install -g bun`)
- Expo CLI (`npm install -g expo-cli`)

## Setup & Installation

1. Install dependencies:

```
bun i
```

2. Start the Next.js API server:

```
cd ../nextjs-ai-chatbot
npm run dev
```

3. Start Expo development server:

```
bun start
# or
bun ios
# or
bun android
```

4. Run on device/simulator:

- Scan QR code with Expo Go app (iOS/Android)
- Press 'i' for iOS simulator
- Press 'a' for Android emulator

## Development

The app requires both the Expo frontend and Next.js backend to be running:

- Expo frontend runs on default Expo port (8081)
- Next.js API runs on http://localhost:3000

## Project Structure

- `/components` - React Native components
- `/screens` - App screens/pages
- `/design-system` - Design system components based on Tailwind CSS
- `/services/auth` - Authentication service

## API

### `useChatFromHistory`

### CustomMarkdown

It has custom Nativewind components and custom rules to better display markdown content in the React Native chat context. It is using the `react-native-markdown-display` library and the `@expo/html-elements` library on top. Per the docs: "It a 100% compatible CommonMark renderer, a react-native markdown renderer done right. This is not a web-view markdown renderer but a renderer that uses native components for all its elements.". It has plugins and extensions too to further enhance the markdown rendering to your needs.
