import React, { useContext } from "react";
import { useSelector } from "react-redux";

import { LineLayer, ShapeSource, SymbolLayer, UserLocation } from "@rnmapbox/maps";

import { COLORS } from "@/constants/colors-constants";
import { BottomSheetContext } from "@/contexts/BottomSheetContext";
import { MapFeatureContext } from "@/contexts/MapFeatureContext";
import { UserLocationContext } from "@/contexts/UserLocationContext";
import { mapLayoutsSelectors } from "@/store/mapLayouts";
import { mapNavigationSelectors } from "@/store/mapNavigation";
import { mapWaypointSelectors } from "@/store/mapWaypoint";
import { GasStation } from "@/types/IGasStation";
import { LayerId } from "@/types/IMap";
import { SearchSuggestionProperties } from "@/types/ISearch";
import { MarkerSheet, SheetType } from "@/types/ISheet";
import { SpeedCameraProperties } from "@/types/ISpeed";
import { IncidentProperties, IncidentType } from "@/types/ITraffic";

const Layers = () => {
    const { userLocation } = useContext(UserLocationContext);
    const { incidents, speedCameras, gasStations } = useContext(MapFeatureContext);
    const { openSheet } = useContext(BottomSheetContext);
    const directions = useSelector(mapNavigationSelectors.directions);
    const isGasStationWaypoint = useSelector(mapWaypointSelectors.selectGasStationWaypoint);
    const categoryLocation = useSelector(mapNavigationSelectors.categoryLocation);
    const openGasStationsList = useSelector(mapLayoutsSelectors.openGasStationsList);

    return (
        <>
            <LineLayer id={LayerId.INVISIBLE} style={{ lineWidth: 0 }} />

            {directions?.geometry && (
                <>
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
                            belowLayerID={LayerId.STREET_NAME}
                        />
                    </ShapeSource>

                    <ShapeSource
                        id="destination-source"
                        shape={{
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates:
                                    directions.geometry.coordinates[directions.geometry.coordinates.length - 1],
                            },
                            properties: {},
                        }}
                    >
                        <SymbolLayer
                            id={LayerId.ROUTE_DESTINATION}
                            style={{
                                iconImage: "route-destination",
                                iconSize: ["interpolate", ["linear"], ["zoom"], 10, 0.4, 15, 0.5, 20, 0.7],
                                iconAllowOverlap: true,
                            }}
                            belowLayerID={LayerId.INVISIBLE}
                        />
                    </ShapeSource>
                </>
            )}

            {categoryLocation && (
                <ShapeSource
                    id="category-source"
                    shape={categoryLocation as GeoJSON.FeatureCollection}
                    onPress={(e) => {
                        openSheet<SearchSuggestionProperties>({
                            type: SheetType.MARKER,
                            markerType: MarkerSheet.CATEGORY_LOCATION,
                            markerProperties: e.features[0].properties as SearchSuggestionProperties,
                        });
                    }}
                >
                    <SymbolLayer
                        id={LayerId.CATEGORY_LOCATION}
                        style={{
                            iconImage: "search-category",
                            iconSize: ["interpolate", ["linear"], ["zoom"], 10, 0, 15, 0.25, 20, 0.5],
                            iconAllowOverlap: true,
                        }}
                        aboveLayerID={LayerId.INVISIBLE}
                    />
                </ShapeSource>
            )}

            {gasStations && (
                <ShapeSource
                    id="gas-station-source"
                    shape={gasStations.gasStations as GeoJSON.FeatureCollection}
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
                            iconSize:
                                isGasStationWaypoint || openGasStationsList
                                    ? ["interpolate", ["linear"], ["zoom"], 10, 0.1, 15, 0.35, 20, 0.65]
                                    : ["interpolate", ["linear"], ["zoom"], 10, 0, 15, 0.25, 20, 0.5],
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
                    id="incident-symbol-source"
                    shape={{
                        type: "FeatureCollection",
                        features: incidents.incidents.data.features.map((incident) => ({
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: (incident.properties as IncidentProperties).firstPoint,
                            },
                            properties: incident.properties,
                        })),
                    }}
                    onPress={(e) => {
                        openSheet<IncidentProperties>({
                            type: SheetType.MARKER,
                            markerType: MarkerSheet.INCIDENT,
                            markerProperties: e.features[0].properties as IncidentProperties,
                        });
                    }}
                >
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
                        aboveLayerID={LayerId.INVISIBLE}
                    />
                </ShapeSource>
            )}

            {userLocation && (
                <UserLocation animated>
                    <SymbolLayer
                        id={LayerId.USER_LOCATION}
                        style={{
                            iconImage: "user-location",
                            iconSize: ["interpolate", ["linear"], ["zoom"], 10, 0.3, 15, 0.4, 20, 0.6],
                            iconAllowOverlap: true,
                            iconRotate: userLocation?.coords.course || 0,
                            iconRotationAlignment: "map",
                        }}
                    />
                </UserLocation>
            )}
        </>
    );
};

export default Layers;
