# Cha-Ching Monorepo �

This is a monorepo containing the Cha-Ching mobile application and its backend server.

## Project Structure

```
cha-ching/
├── client/          # React Native/Expo mobile app
├── server/          # Backend server (placeholder)
└── package.json     # Root workspace configuration
```

## Get started

1. Install dependencies for all workspaces

   ```bash
   bun install:all
   ```

2. Start the mobile app (client)

   ```bash
   bun client:start
   ```

3. Run on specific platforms

   ```bash
   bun client:android    # Android
   bun client:ios        # iOS
   bun client:web        # Web
   ```

## Client App

The client is an [Expo](https://expo.dev) React Native application located in the `client/` directory. It uses [file-based routing](https://docs.expo.dev/router/introduction) and you can start developing by editing the files inside the **client/app** directory.

## Server

The server is located in the `server/` directory and is currently a placeholder for future backend development.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
