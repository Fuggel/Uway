export default ({ config }) => {
    const MAPBOX_TOKEN = process.env.EXPO_SECRET_MAPBOX_ACCESS_TOKEN;
    return {
        ...config,
        name: "NavSync",
        slug: "NavSync",
        version: "1.1.1",
        orientation: "portrait",
        icon: "./src/assets/images/build/icon.png",
        scheme: "myapp",
        userInterfaceStyle: "automatic",
        extra: {
            eas: {
                projectId: "db71619c-6270-4e2f-b360-8d388fba3d85"
            },
        },
        splash: {
            image: "./src/assets/images/build/splash.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        ios: {
            buildNumber: "1.1.1",
            supportsTablet: true,
            bundleIdentifier: "com.fuggel.NavSync"
        },
        android: {
            versionCode: 1,
            adaptiveIcon: {
                foregroundImage: "./src/assets/images/build/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            package: "com.fuggel.NavSync",
            permissions: [
                "android.permission.ACCESS_COARSE_LOCATION",
                "android.permission.ACCESS_FINE_LOCATION"
            ]
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./src/assets/images/build/favicon.png"
        },
        experiments: {
            typedRoutes: true
        },
        plugins: [
            "expo-router",
            [
                "@rnmapbox/maps",
                {
                    RNMapboxMapsDownloadToken: MAPBOX_TOKEN,
                    RNMapboxMapsVersion: "10.16.0"
                }
            ],
            [
                "expo-location",
                {
                    locationWhenInUsePermission: "Show current location on map."
                }
            ]
        ]
    };
};
