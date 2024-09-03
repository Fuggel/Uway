#!/bin/bash

# Source the .env file to load environment variables
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Ensure the environment variable is set
if [ -z "$EXPO_SECRET_MAPBOX_ACCESS_TOKEN" ]; then
  echo "EXPO_SECRET_MAPBOX_ACCESS_TOKEN is not set. Please set it before running this script."
  exit 1
fi

# Run expo prebuild
echo "Running expo prebuild..."
npx expo prebuild

# Define the environment variable
MAPBOX_TOKEN=$EXPO_SECRET_MAPBOX_ACCESS_TOKEN

# Update build.gradle
echo "Updating build.gradle..."
# Insert mapboxToken definition after `def jscFlavor = 'org.webkit:android-jsc:+'`
sed -i '' "/^def jscFlavor = 'org.webkit:android-jsc:\+'/a\\
def mapboxToken = System.getenv(\"EXPO_SECRET_MAPBOX_ACCESS_TOKEN\")" android/app/build.gradle

# Ensure buildConfigField references the mapboxToken
sed -i '' "/^defaultConfig {/a\\
    buildConfigField \"String\", \"EXPO_SECRET_MAPBOX_ACCESS_TOKEN\", \"\\\"${MAPBOX_TOKEN}\\\"\"" android/app/build.gradle

# Remove the MAPBOX_DOWNLOADS_TOKEN from gradle.properties
echo "Cleaning up gradle.properties..."
sed -i '' '/^MAPBOX_DOWNLOADS_TOKEN=/d' android/gradle.properties

# Update Podfile
echo "Updating Podfile..."
sed -i '' "s/\$RNMapboxMapsDownloadToken = .*/\$RNMapboxMapsDownloadToken = ENV['EXPO_SECRET_MAPBOX_ACCESS_TOKEN']/" ios/Podfile

echo "Build configuration updated successfully."