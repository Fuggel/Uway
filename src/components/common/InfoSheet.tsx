import React from "react";
import { Image, ImageProps, StyleSheet, View } from "react-native";

import { SIZES } from "@/constants/size-constants";

import Divider from "./Divider";
import Text from "./Text";

interface InfoSheetProps {
    title: string;
    subtitle: string | null;
    img: ImageProps;
    children?: React.ReactNode;
}

const InfoSheet = ({ title, subtitle, img, children }: InfoSheetProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.contentWrapper}>
                <View style={styles.header}>
                    <Image resizeMode="contain" source={img} style={styles.image} />

                    <View>
                        <Text textStyle="header" type="white">
                            {title}
                        </Text>
                        {subtitle && <Text type="lightGray">{subtitle}</Text>}
                    </View>
                </View>

                <Divider />

                {children}
            </View>
        </View>
    );
};

export default InfoSheet;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: SIZES.spacing.lg,
        paddingBottom: SIZES.spacing.md,
    },
    contentWrapper: {
        marginTop: SIZES.spacing.sm,
        marginBottom: SIZES.spacing.md,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: SIZES.spacing.md,
    },
    image: {
        width: SIZES.iconSize.xxl,
        height: SIZES.iconSize.xxl,
    },
});
