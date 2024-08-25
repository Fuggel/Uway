export default ({ config }) => ({
    ...config,
    name: "NavSync",
    slug: "NavSync",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/images/build/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
        image: "./src/assets/images/build/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
    },
    ios: {
        supportsTablet: true,
        bundleIdentifier: "com.fuggel.NavSync"
    },
    android: {
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
                RNMapboxMapsDownloadToken: "pk.eyJ1IjoiZnVnZ2VsLWRldiIsImEiOiJjbHp5ZzYybXkweG11MmxzaTRwdnVucDB4In0.KhhCb-EWGrZDHEMw_n3LAA",
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
});
