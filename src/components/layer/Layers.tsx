import { useContext } from "react";
import { useSelector } from "react-redux";

import { LineLayer, ShapeSource, SymbolLayer, UserLocation } from "@rnmapbox/maps";

import { COLORS } from "@/constants/colors-constants";
import { SIZES } from "@/constants/size-constants";
import { BottomSheetContext } from "@/contexts/BottomSheetContext";
import { MapFeatureContext } from "@/contexts/MapFeatureContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import useGasStations from "@/hooks/useGasStations";
import useLocationPermission from "@/hooks/useLocationPermissions";
import useParkAvailability from "@/hooks/useParkAvailability";
import { mapViewSelectors } from "@/store/mapView";
import { GasStation } from "@/types/IGasStation";
import { LayerId } from "@/types/IMap";
import { Direction } from "@/types/INavigation";
import { ParkAvailabilityProperties } from "@/types/IParking";
import { MarkerSheet, SheetType } from "@/types/ISheet";
import { SpeedCameraProperties } from "@/types/ISpeed";
import { IncidentProperties, IncidentType } from "@/types/ITraffic";
import { determineTheme } from "@/utils/theme-utils";

interface LayersProps {
    directions: Direction | null;
}

const Layers = ({ directions }: LayersProps) => {
    const { hasLocationPermissions } = useLocationPermission();
    const { userLocation } = useContext(UserLocationContext);
    const mapStyle = useSelector(mapViewSelectors.mapboxTheme);
    const { incidents, speedCameras } = useContext(MapFeatureContext);
    const { openSheet } = useContext(BottomSheetContext);
    const { parkAvailability } = useParkAvailability();
    const { gasStations } = useGasStations();

    return (
        <>
            <LineLayer id={LayerId.INVISIBLE} style={{ lineWidth: 0 }} />

            {directions?.geometry && (
                <ShapeSource id="route-source" shape={directions.geometry as GeoJSON.Geometry}>
                    <LineLayer
                        id={LayerId.ROUTE}
                        style={{
                            lineColor: COLORS.secondary_light,
                            lineOpacity: 0.8,
                            lineCap: "round",
                            lineJoin: "round",
                            lineWidth: ["interpolate", ["exponential", 1.5], ["zoom"], 10, 5, 15, 8, 20, 20],
                        }}
                        belowLayerID={LayerId.INVISIBLE}
                    />
                </ShapeSource>
            )}

            {parkAvailability?.features && (
                <ShapeSource
                    id="parking-availability-source"
                    shape={parkAvailability as GeoJSON.FeatureCollection}
                    onPress={(e) => {
                        openSheet<ParkAvailabilityProperties>({
                            type: SheetType.MARKER,
                            markerType: MarkerSheet.PARKING,
                            markerProperties: e.features[0].properties as ParkAvailabilityProperties,
                        });
                    }}
                >
                    <SymbolLayer
                        id={LayerId.PARKING_AVAILABILITY}
                        style={{
                            iconImage: "parking-availability",
                            textField: ["format", ["get", "name"], "\n", ["get", "free"], " / ", ["get", "total"]],
                            textSize: SIZES.fontSize.sm,
                            textOpacity: ["interpolate", ["linear"], ["zoom"], 10, 0, 15, 0, 16, 1],
                            textColor: determineTheme(mapStyle) === "dark" ? COLORS.white : COLORS.primary,
                            textOffset: [0, 2.5],
                            iconSize: ["interpolate", ["linear"], ["zoom"], 10, 0, 15, 0.25, 20, 0.3],
                            iconAllowOverlap: true,
                            iconRotate: 0,
                        }}
                        aboveLayerID={LayerId.INVISIBLE}
                    />
                </ShapeSource>
            )}

            {gasStations && (
                <ShapeSource
                    id="gas-station-source"
                    shape={gasStations as GeoJSON.FeatureCollection}
                    onPress={(e) => {
                        openSheet<GasStation>({
                            type: SheetType.MARKER,
                            markerType: MarkerSheet.GAS_STATION,
                            markerProperties: e.features[0].properties as GasStation,
                        });
                    }}
                >
                    <SymbolLayer
                        id={LayerId.GAS_STATION}
                        style={{
                            iconImage: ["get", "iconType"],
                            iconSize: ["interpolate", ["linear"], ["zoom"], 10, 0, 15, 0.25, 20, 0.5],
                            iconAllowOverlap: true,
                            iconRotate: 0,
                        }}
                        aboveLayerID={LayerId.INVISIBLE}
                    />
                </ShapeSource>
            )}

            {speedCameras.speedCameras?.data && (
                <ShapeSource
                    id="speed-camera-source"
                    shape={speedCameras.speedCameras.data as GeoJSON.FeatureCollection}
                    onPress={(e) => {
                        openSheet<SpeedCameraProperties>({
                            type: SheetType.MARKER,
                            markerType: MarkerSheet.SPEED_CAMERA,
                            markerProperties: e.features[0].properties as SpeedCameraProperties,
                        });
                    }}
                >
                    <SymbolLayer
                        id={LayerId.SPEED_CAMERA}
                        style={{
                            iconImage: "speed-camera",
                            iconSize: ["interpolate", ["linear"], ["zoom"], 10, 0, 15, 0.25, 20, 0.5],
                            iconAllowOverlap: true,
                            iconRotate: 0,
                            visibility: "visible",
                        }}
                        aboveLayerID={LayerId.INVISIBLE}
                    />
                </ShapeSource>
            )}

            {incidents?.incidents?.data && (
                <ShapeSource
                    id="incident-source"
                    shape={incidents.incidents.data as GeoJSON.FeatureCollection}
                    onPress={(e) => {
                        openSheet<IncidentProperties>({
                            type: SheetType.MARKER,
                            markerType: MarkerSheet.INCIDENT,
                            markerProperties: e.features[0].properties as IncidentProperties,
                        });
                    }}
                >
                    <LineLayer
                        id={LayerId.INCIDENT_LINE}
                        style={{
                            lineWidth: ["interpolate", ["exponential", 1.5], ["zoom"], 10, 5, 15, 8, 20, 20],
                            lineColor: "#FF0000",
                            lineOpacity: ["interpolate", ["linear"], ["zoom"], 10, 0, 15, 0, 18, 1, 20, 1],
                            lineCap: "round",
                            lineJoin: "round",
                            visibility: "visible",
                        }}
                        aboveLayerID={LayerId.INVISIBLE}
                    />
                    <SymbolLayer
                        id={LayerId.INCIDENT_SYMBOL}
                        style={{
                            iconSize: ["interpolate", ["linear"], ["zoom"], 10, 0, 15, 0.25, 20, 0.3],
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
                            iconAllowOverlap: true,
                            iconRotate: 0,
                        }}
                        aboveLayerID={LayerId.INCIDENT_LINE}
                    />
                </ShapeSource>
            )}

            {hasLocationPermissions && (
                <UserLocation animated>
                    <SymbolLayer
                        id={LayerId.USER_LOCATION}
                        style={{
                            iconImage: "user-location",
                            iconSize: ["interpolate", ["linear"], ["zoom"], 10, 0.3, 15, 0.4, 20, 0.6],
                            iconAllowOverlap: true,
                            iconRotate: userLocation?.coords.heading || 0,
                            iconRotationAlignment: "map",
                        }}
                    />
                </UserLocation>
            )}
        </>
    );
};

export default Layers;
