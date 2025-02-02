import { LineLayer, ShapeSource, SymbolLayer } from "@rnmapbox/maps";

import { COLORS } from "@/constants/colors-constants";
import { LayerId } from "@/types/IMap";
import { Direction } from "@/types/INavigation";

export const renderRouteLayer = (params: { selectedRoute: number; route: Direction; index: number }) => {
    const isSelected = params.index === params.selectedRoute;

    return (
        <ShapeSource
            key={`route-source-${params.index}`}
            id={`route-source-${params.index}`}
            shape={params.route.geometry as GeoJSON.Geometry}
        >
            <LineLayer
                id={`route-layer-${params.index}`}
                style={{
                    lineColor: isSelected ? COLORS.secondary_light : COLORS.light_gray,
                    lineOpacity: isSelected ? 0.8 : 0.5,
                    lineCap: "round",
                    lineJoin: "round",
                    lineWidth: ["interpolate", ["exponential", 1.5], ["zoom"], 10, 5, 15, 8, 20, 20],
                }}
                belowLayerID={LayerId.STREET_NAME}
            />
        </ShapeSource>
    );
};

export const renderDestinationMarker = (route: Direction) => (
    <ShapeSource
        id="destination-source"
        shape={{
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: route.geometry.coordinates[route.geometry.coordinates.length - 1],
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
);
