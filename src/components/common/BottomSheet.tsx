import { DimensionValue, StyleSheet, ViewStyle } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import BottomSheet, { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";

interface BottomSheetComponentProps {
    onClose: () => void;
    children: React.ReactNode;
    height?: DimensionValue;
    snapPoints?: string[];
    st?: ViewStyle;
}

const BottomSheetComponent = ({ onClose, children, snapPoints, height, st }: BottomSheetComponentProps) => {
    const ContentContainer = height && snapPoints ? BottomSheetView : BottomSheetScrollView;

    return (
        <GestureHandlerRootView style={{ ...styles.container, height: height ?? "30%" }}>
            <BottomSheet
                backgroundStyle={styles.bottomSheetBackground}
                handleIndicatorStyle={styles.indicatorStyle}
                snapPoints={snapPoints ?? ["100%"]}
                enablePanDownToClose
                onClose={onClose}
                enableDynamicSizing
            >
                <ContentContainer style={{ ...styles.contentContainer, ...st }}>{children}</ContentContainer>
            </BottomSheet>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999999,
    },
    bottomSheetBackground: {
        backgroundColor: COLORS.primary_light,
        borderRadius: SIZES.borderRadius.lg,
    },
    indicatorStyle: {
        backgroundColor: COLORS.gray,
        width: SIZES.spacing.xxl,
        marginTop: SIZES.spacing.xs,
    },
    contentContainer: {
        flex: 1,
    },
});

export default BottomSheetComponent;
