import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

import Text from "@/components/common/Text";

const NotFoundScreen = () => {
    return (
        <>
            <Stack.Screen options={{ title: "Oops!" }} />
            <View style={styles.container}>
                <Text type="dark" textStyle="header">
                    This screen doesn't exist.
                </Text>
                <Link href="./" style={styles.link}>
                    <Text type="dark">Go to home screen!</Text>
                </Link>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
});

export default NotFoundScreen;
