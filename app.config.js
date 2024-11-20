export default ({ config }) => {
    const MAPBOX_TOKEN = process.env.EXPO_SECRET_MAPBOX_ACCESS_TOKEN;
    return {
        ...config,
        owner: "fuggel",
        name: "Uway",
        slug: "uway",
        version: "0.1.2",
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
            image: "./src/assets/images/build/splash.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff",
        },
        ios: {
            buildNumber: "0.1.2",
            supportsTablet: true,
            bundleIdentifier: "com.fuggel.Uway",
            infoPlist: {
                NSPhotoLibraryUsageDescription: "This app does not require photo library access.",
            }
        },
        android: {
            versionCode: 1,
            adaptiveIcon: {
                foregroundImage: "./src/assets/images/build/adaptive-icon.png",
                backgroundColor: "#ffffff",
            },
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
                    locationWhenInUsePermission: "Show current location on map.",
                },
            ],
            [
                "@react-native-voice/voice",
                {
                    microphonePermission: "Allow to access the microphone to search for locations.",
                    speechRecognitionPermission: "Allow to securely recognize user speech.",
                },
            ],
        ],
    };
};
