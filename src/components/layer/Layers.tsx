import React, { useContext } from "react";
import { useSelector } from "react-redux";

import { CircleLayer, LineLayer, ShapeSource, SymbolLayer, UserLocation } from "@rnmapbox/maps";

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

import { renderDestinationMarker, renderRouteLayer } from "./RouteLayers";

const Layers = () => {
    const { userLocation } = useContext(UserLocationContext);
    const { incidents, speedCameras, gasStations } = useContext(MapFeatureContext);
    const { openSheet } = useContext(BottomSheetContext);
    const routeOptions = useSelector(mapNavigationSelectors.routeOptions);
    const selectedRoute = useSelector(mapNavigationSelectors.selectedRoute);
    const directions = useSelector(mapNavigationSelectors.directions);
    const isGasStationWaypoint = useSelector(mapWaypointSelectors.selectGasStationWaypoint);
    const categoryLocation = useSelector(mapNavigationSelectors.categoryLocation);
    const openGasStationsList = useSelector(mapLayoutsSelectors.openGasStationsList);
    const isNavigationMode = useSelector(mapNavigationSelectors.isNavigationMode);

    return (
        <>
            <LineLayer id={LayerId.INVISIBLE} style={{ lineWidth: 0 }} />

            {directions?.geometry && (
                <>
                    {renderRouteLayer({ selectedRoute, route: directions, index: selectedRoute })}
                    {renderDestinationMarker(directions)}
                </>
            )}

            {routeOptions?.map((route, index) => (
                <React.Fragment key={index}>
                    {renderRouteLayer({ selectedRoute, route, index })}
                    {renderDestinationMarker(route)}
                </React.Fragment>
            ))}

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
                <UserLocation animated coordinates={[userLocation.coords.longitude, userLocation.coords.latitude]}>
                    <CircleLayer
                        id={LayerId.GPS_ACCURACY}
                        style={{
                            visibility: isNavigationMode ? "visible" : "none",
                            circleRadius: [
                                "interpolate",
                                ["linear"],
                                ["zoom"],
                                10,
                                Math.max(userLocation.coords.accuracy ?? 10, 8) * 2,
                                18,
                                Math.max(userLocation.coords.accuracy ?? 10, 8) * 3,
                            ],
                            circleColor: "rgba(0, 122, 252, 0.6)",
                            circleOpacity: 0.6,
                            circleStrokeWidth: 1,
                            circleStrokeColor: "rgba(0, 122, 252, 0.9)",
                        }}
                    />

                    <SymbolLayer
                        id={LayerId.USER_LOCATION}
                        style={{
                            iconImage: "user-location",
                            iconSize: ["interpolate", ["linear"], ["zoom"], 10, 0.3, 15, 0.4, 20, 0.6],
                            iconAllowOverlap: true,
                            iconRotate: userLocation?.coords.course || 0,
                            iconRotationAlignment: "map",
                        }}
                        aboveLayerID={LayerId.GPS_ACCURACY}
                    />
                </UserLocation>
            )}
        </>
    );
};

export default Layers;
