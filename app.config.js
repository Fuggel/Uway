export default ({ config }) => {
    const MAPBOX_TOKEN = process.env.EXPO_SECRET_MAPBOX_ACCESS_TOKEN;
    return {
        ...config,
        owner: "fuggel",
        name: "Uway",
        slug: "uway",
        version: "0.1.4",
        orientation: "portrait",
        icon: "./src/assets/images/build/icon.png",
        scheme: "Uway",
        userInterfaceStyle: "automatic",
        extra: {
            eas: {
                projectId: "f9f3d280-e3c2-49cc-afdc-09c23e152383",
            },
        },
        splash: {
            image: "./src/assets/images/build/splash-screen.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff",
        },
        ios: {
            buildNumber: "0.1.4",
            supportsTablet: true,
            bundleIdentifier: "com.fuggel.Uway",
            infoPlist: {
                NSPhotoLibraryUsageDescription: "Uway benötigt keinen Zugriff auf deine Galerie.",
            },
        },
        android: {
            versionCode: 1,
            adaptiveIcon: {
                foregroundImage: "./src/assets/images/build/android-adaptive-icon.png",
                backgroundColor: "#ffffff",
            },
            icon: "./src/assets/images/build/android-icon.png",
            package: "com.fuggel.Uway",
            permissions: ["android.permission.ACCESS_COARSE_LOCATION", "android.permission.ACCESS_FINE_LOCATION"],
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./src/assets/images/build/favicon.png",
        },
        experiments: {
            typedRoutes: true,
        },
        plugins: [
            "expo-router",
            [
                "@rnmapbox/maps",
                {
                    RNMapboxMapsDownloadToken: MAPBOX_TOKEN,
                    RNMapboxMapsVersion: "10.16.0",
                },
            ],
            [
                "expo-location",
                {
                    locationWhenInUsePermission: "Erlaube Uway deinen Standort zu verwenden.",
                },
            ],
            [
                "@react-native-voice/voice",
                {
                    microphonePermission: "Erlaube Uway auf dein Mikrofon zuzugreifen, um nach Orten zu suchen.",
                    speechRecognitionPermission: "Erlaube Uway sicher deine Sprache zu erkennen.",
                },
            ],
        ],
    };
};
