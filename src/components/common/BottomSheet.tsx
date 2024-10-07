import { ScrollView, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

interface BottomSheetComponentProps {
    onClose: () => void;
    children: React.ReactNode;
    st?: StyleSheet;
}

const BottomSheetComponent = ({ onClose, children, st }: BottomSheetComponentProps) => {
    return (
        <GestureHandlerRootView style={styles.container}>
            <BottomSheet snapPoints={["50%", "100%"]} enablePanDownToClose onClose={onClose}>
                <ScrollView>
                    <BottomSheetView style={{ ...styles.contentContainer, ...st }}>{children}</BottomSheetView>
                </ScrollView>
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
        height: "40%",
        backgroundColor: "transparent",
    },
    contentContainer: {
        flex: 1,
        alignItems: "center",
    },
});

export default BottomSheetComponent;
