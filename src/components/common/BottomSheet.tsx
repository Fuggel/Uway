import { StyleSheet } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface BottomSheetComponentProps {
    onClose: () => void;
    children: React.ReactNode;
    st?: StyleSheet;
}

export default function BottomSheetComponent({ onClose, children, st }: BottomSheetComponentProps) {
    return (
        <GestureHandlerRootView style={styles.container}>
            <BottomSheet snapPoints={["100%"]} enablePanDownToClose onClose={onClose}>
                <BottomSheetView style={{ ...styles.contentContainer, ...st }}>
                    {children}
                </BottomSheetView>
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
        height: "30%",
        backgroundColor: "transparent",
    },
    contentContainer: {
        flex: 1,
        alignItems: "center",
    },
});