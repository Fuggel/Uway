import { StyleSheet, View } from "react-native";
import { Button, Modal as RNPModal } from "react-native-paper";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";

interface ModalProps {
    visible: boolean;
    onSave: () => void;
    onDismiss: () => void;
    children: React.ReactNode;
}

const Modal = ({ visible, onSave, onDismiss, children }: ModalProps) => {
    return (
        <RNPModal contentContainerStyle={styles.container} visible={visible} onDismiss={onDismiss}>
            <View style={styles.content}>
                {children}

                <View style={styles.buttons}>
                    <Button
                        contentStyle={{ ...styles.buttonContent, backgroundColor: COLORS.gray }}
                        labelStyle={styles.buttonLabel}
                        onPress={onDismiss}
                    >
                        Abbrechen
                    </Button>

                    <Button
                        contentStyle={{ ...styles.buttonContent, backgroundColor: COLORS.secondary }}
                        labelStyle={styles.buttonLabel}
                        onPress={onSave}
                    >
                        Speichern
                    </Button>
                </View>
            </View>
        </RNPModal>
    );
};

export default Modal;

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        backgroundColor: COLORS.white,
        margin: SIZES.spacing.md,
        padding: SIZES.spacing.md,
        borderRadius: SIZES.borderRadius.md,
    },
    content: {
        gap: SIZES.spacing.md,
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "center",
        gap: SIZES.spacing.md,
    },
    buttonContent: {
        paddingVertical: SIZES.spacing.xxs,
        paddingHorizontal: SIZES.spacing.sm,
    },
    buttonLabel: {
        fontSize: SIZES.fontSize.md,
        color: COLORS.white,
    },
});
