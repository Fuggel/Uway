import { useContext } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import { UserLocation } from "@rnmapbox/maps";
import { Point } from "@turf/helpers";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { MapFeatureContext } from "@/contexts/MapFeatureContext";
import { MarkerBottomSheetContext } from "@/contexts/MarkerBottomSheetContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import useGasStations from "@/hooks/useGasStations";
import useLocationPermission from "@/hooks/useLocationPermissions";
import useParkAvailability from "@/hooks/useParkAvailability";
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
    const { setUserLocation } = useContext(UserLocationContext);
    const { incidents, speedCameras } = useContext(MapFeatureContext);
    const { hasLocationPermissions } = useLocationPermission();
    const { gasStations } = useGasStations();
    const { parkAvailability } = useParkAvailability();

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
                        belowLayerId="mapboxUserLocationPulseCircle"
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
                    belowLayerId="mapboxUserLocationPulseCircle"
                />
            ))}
            {speedCameras?.speedCameras?.data?.features?.map((feature, i) => (
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
                    belowLayerId="mapboxUserLocationPulseCircle"
                />
            ))}
            {incidents?.incidents?.data?.incidents?.map((incident, i) => (
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
                        belowLayerId="mapboxUserLocationPulseCircle"
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
                        belowLayerId="mapboxUserLocationPulseCircle"
                    />
                </View>
            ))}

            {hasLocationPermissions && (
                <UserLocation
                    animated
                    showsUserHeadingIndicator
                    styles={{
                        pulse: {
                            circleRadius: ["interpolate", ["exponential", 1.5], ["zoom"], 0, 15, 18, 18, 20, 21],
                            circleColor: COLORS.primary,
                            circleOpacity: 0.2,
                        },
                        background: {
                            circleRadius: ["interpolate", ["exponential", 1.5], ["zoom"], 0, 9, 18, 12, 20, 15],
                            circleColor: COLORS.white,
                        },
                        foreground: {
                            circleRadius: ["interpolate", ["exponential", 1.5], ["zoom"], 0, 6, 18, 9, 20, 12],
                            circleColor: COLORS.primary,
                        },
                    }}
                    headingIconSize={["interpolate", ["exponential", 1.5], ["zoom"], 0, 0, 18, 1.1, 20, 1.3]}
                    onUpdate={(location) => setUserLocation(location)}
                />
            )}
        </>
    );
};

export default Layers;
