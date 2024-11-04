import * as Application from "expo-application";
import { useContext, useEffect, useState } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import { Button, SegmentedButtons } from "react-native-paper";

import { UseMutateFunction } from "@tanstack/react-query";

import { COLORS } from "@/constants/colors-constants";
import { SPEED_CAMERA_TYPE } from "@/constants/map-constants";
import { SIZES } from "@/constants/size-constants";
import { MapFeatureContext } from "@/contexts/MapFeatureContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { OpenSheet } from "@/types/IMap";
import { SpeedCameraType } from "@/types/ISpeed";

import BottomSheetComponent from "../common/BottomSheet";
import Text from "../common/Text";

interface MapSpeedCameraReportProps {
    refetchData: UseMutateFunction<any, unknown, any, unknown>;
    error: any;
    setOpen: React.Dispatch<React.SetStateAction<OpenSheet>>;
}

const deviceHeight = Dimensions.get("window").height;

const MapSpeedCameraReport = ({ refetchData, error, setOpen }: MapSpeedCameraReportProps) => {
    const { userLocation } = useContext(UserLocationContext);
    const { speedCameras } = useContext(MapFeatureContext);
    const [deviceId, setDeviceId] = useState("");
    const [selectedType, setSelectedType] = useState<SpeedCameraType>(SpeedCameraType.MOBILE);

    const longitude = userLocation?.coords?.longitude;
    const latitude = userLocation?.coords?.latitude;
    const heading = userLocation?.coords?.heading;

    useEffect(() => {
        const fetchDeviceId = async () => {
            if (Platform.OS === "android") {
                const id = Application.getAndroidId();
                setDeviceId(id);
            } else if (Platform.OS === "ios") {
                const id = await Application.getIosIdForVendorAsync();
                setDeviceId(id || "");
            }
        };

        fetchDeviceId();
    }, []);

    const handleReport = () => {
        refetchData({
            deviceId,
            type: selectedType,
            coordinates: [longitude as number, latitude as number],
            direction: heading ? heading.toString() : "0",
        });

        speedCameras.refetchSpeedCameras();
    };

    return (
        <BottomSheetComponent
            height={deviceHeight > 1000 ? "20%" : "30%"}
            snapPoints={["100%"]}
            onClose={() => {
                setOpen((prev) => ({ ...prev, speedCamera: false }));
            }}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text type="dark" textStyle="header">
                        Blitzer melden
                    </Text>
                </View>

                <View style={styles.reportForm}>
                    <SegmentedButtons
                        style={{ width: "70%" }}
                        value={selectedType}
                        onValueChange={(value) => setSelectedType(value as SpeedCameraType)}
                        buttons={SPEED_CAMERA_TYPE.map((p) => ({
                            value: p.value,
                            label: p.label,
                            checkedColor: COLORS.white,
                            style: {
                                backgroundColor: p.value === selectedType ? COLORS.primary : COLORS.white,
                            },
                        }))}
                    />

                    <View style={styles.buttonContainer}>
                        <Button
                            mode="contained"
                            style={{ backgroundColor: COLORS.gray }}
                            onPress={() => setOpen((prev) => ({ ...prev, speedCamera: false }))}
                        >
                            Abbrechen
                        </Button>

                        <Button mode="contained" style={{ backgroundColor: COLORS.primary }} onPress={handleReport}>
                            Melden
                        </Button>
                    </View>
                </View>
            </View>
        </BottomSheetComponent>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: SIZES.spacing.md,
        gap: SIZES.spacing.md,
    },
    header: {
        marginHorizontal: "auto",
        marginTop: SIZES.spacing.sm,
    },
    reportForm: {
        justifyContent: "center",
        alignItems: "center",
        gap: SIZES.spacing.md,
    },
    buttonContainer: {
        flexDirection: "row",
        gap: SIZES.spacing.md,
    },
});

export default MapSpeedCameraReport;
