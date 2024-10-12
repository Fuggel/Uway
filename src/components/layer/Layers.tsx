import { useContext } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import { Point } from "@turf/helpers";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { MarkerBottomSheetContext } from "@/contexts/MarkerBottomSheetContext";
import useGasStations from "@/hooks/useGasStations";
import useIncidents from "@/hooks/useIncidents";
import useParkAvailability from "@/hooks/useParkAvailability";
import useSpeedCameras from "@/hooks/useSpeedCameras";
import { mapViewSelectors } from "@/store/mapView";
import { GasStation } from "@/types/IGasStation";
import { Direction } from "@/types/INavigation";
import { ParkAvailabilityProperties } from "@/types/IParking";
import { MarkerSheet } from "@/types/ISheet";
import { SpeedCameraProperties } from "@/types/ISpeed";
import { IncidentProperties, IncidentType } from "@/types/ITraffic";
import { getStationIcon } from "@/utils/map-utils";
import { determineTheme } from "@/utils/theme-utils";

import LineLayer from "./LineLayer";
import SymbolLayer from "./SymbolLayer";

interface LayersProps {
    directions: Direction | null;
}

const Layers = ({ directions }: LayersProps) => {
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);
    const { openSheet } = useContext(MarkerBottomSheetContext);
    const { gasStations } = useGasStations();
    const { parkAvailability } = useParkAvailability();
    const { speedCameras } = useSpeedCameras();
    const { incidents } = useIncidents();

    return (
        <>
            {directions?.geometry?.coordinates && (
                <LineLayer
                    sourceId="route-source"
                    layerId="route-layer"
                    coordinates={directions.geometry.coordinates}
                    style={{
                        lineWidth: ["interpolate", ["exponential", 1.5], ["zoom"], 10, 5, 15, 8, 20, 20],
                    }}
                />
            )}
            {parkAvailability?.features?.map((feature, i) => (
                <View key={i}>
                    <SymbolLayer
                        sourceId={`parking-availability-source-${i}`}
                        layerId={`parking-availability-layer-${i}`}
                        coordinates={(feature.geometry as Point).coordinates}
                        onPress={() => {
                            openSheet<ParkAvailabilityProperties>(
                                MarkerSheet.PARKING,
                                feature.properties as ParkAvailabilityProperties
                            );
                        }}
                        properties={feature.properties}
                        style={{
                            iconImage: "parking-availability",
                            textField: `
                                    ${feature.properties?.name}
                                    ${feature.properties?.free} / ${feature.properties?.total}
                                `,
                            textSize: SIZES.fontSize.sm,
                            textColor: determineTheme(mapStyle) === "dark" ? COLORS.white : COLORS.gray,
                            textOffset: [0, 2.5],
                            iconSize: ["interpolate", ["linear"], ["zoom"], 10, 0.4, 20, 0.6],
                        }}
                        belowLayerId="user-location-layer"
                    />
                </View>
            ))}
            {gasStations?.features?.map((feature, i) => (
                <SymbolLayer
                    key={i}
                    sourceId={`gas-station-source-${i}`}
                    layerId={`gas-station-layer-${i}`}
                    coordinates={(feature.geometry as Point).coordinates}
                    onPress={() => openSheet<GasStation>(MarkerSheet.GAS_STATION, feature.properties as GasStation)}
                    properties={feature.properties}
                    style={{
                        iconImage: getStationIcon(
                            gasStations.features.map((f) => f.properties as GasStation),
                            feature.properties?.diesel
                        ),
                        iconSize: ["interpolate", ["linear"], ["zoom"], 10, 0.5, 20, 0.7],
                    }}
                    belowLayerId="user-location-layer"
                />
            ))}
            {speedCameras?.data?.features?.map((feature, i) => (
                <SymbolLayer
                    key={i}
                    sourceId={`speed-camera-source-${i}`}
                    layerId={`speed-camera-layer-${i}`}
                    coordinates={(feature.geometry as Point).coordinates}
                    onPress={() =>
                        openSheet<SpeedCameraProperties>(
                            MarkerSheet.SPEED_CAMERA,
                            feature.properties as SpeedCameraProperties
                        )
                    }
                    style={{
                        iconImage: "speed-camera",
                        iconSize: ["interpolate", ["linear"], ["zoom"], 10, 0.4, 20, 0.6],
                    }}
                    belowLayerId="user-location-layer"
                />
            ))}
            {incidents?.data?.incidents?.map((incident, i) => (
                <View key={i}>
                    <LineLayer
                        sourceId={`incident-line-source-${i}`}
                        layerId={`incident-line-layer-${i}`}
                        coordinates={incident.geometry.coordinates}
                        properties={incident.properties}
                        style={{
                            lineWidth: ["interpolate", ["exponential", 1.5], ["zoom"], 10, 5, 15, 8, 20, 20],
                            lineColor: "#FF0000",
                        }}
                        belowLayerId="user-location-layer"
                    />
                    <SymbolLayer
                        key={i}
                        sourceId={`incident-symbol-source-${i}`}
                        layerId={`incident-symbol-layer-${i}`}
                        coordinates={incident.geometry.coordinates[incident.geometry.coordinates.length - 1]}
                        onPress={() =>
                            openSheet<IncidentProperties>(
                                MarkerSheet.INCIDENT,
                                incident.properties as IncidentProperties
                            )
                        }
                        properties={incident.properties}
                        style={{
                            iconSize: ["interpolate", ["linear"], ["zoom"], 10, 0.5, 20, 0.7],
                            iconImage: [
                                "match",
                                ["get", "iconCategory"],
                                IncidentType.Accident,
                                "incident-accident",
                                IncidentType.Rain,
                                "incident-rain",
                                IncidentType.Ice,
                                "incident-ice",
                                IncidentType.Jam,
                                "incident-jam",
                                IncidentType.LaneClosed,
                                "incident-road-closure",
                                IncidentType.RoadClosed,
                                "incident-road-closure",
                                IncidentType.RoadWorks,
                                "incident-road-works",
                                IncidentType.Wind,
                                "incident-wind",
                                IncidentType.BrokenDownVehicle,
                                "incident-broken-down-vehicle",
                                "incident-caution",
                            ],
                        }}
                        belowLayerId="user-location-layer"
                    />
                </View>
            ))}
        </>
    );
};

export default Layers;
