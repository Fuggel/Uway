import { LineLayer as Layer, ShapeSource } from "@rnmapbox/maps";

import { COLORS } from "@/constants/colors-constants";

interface LineLayerProps<T> {
    sourceId: string;
    layerId: string;
    coordinates: number[][];
    properties?: T;
    style?: any;
    belowLayerId?: string;
}

const LineLayer = <T,>({ sourceId, layerId, coordinates, properties, style, belowLayerId }: LineLayerProps<T>) => {
    return (
        <ShapeSource
            id={sourceId}
            shape={{
                type: "Feature",
                properties: properties ?? {},
                geometry: {
                    type: "LineString",
                    coordinates,
                },
            }}
        >
            <Layer
                id={layerId}
                style={{
                    lineColor: COLORS.secondary_light,
                    lineWidth: 5,
                    lineOpacity: 0.8,
                    lineCap: "round",
                    lineJoin: "round",
                    ...style,
                }}
                belowLayerID={belowLayerId}
            />
        </ShapeSource>
    );
};

export default LineLayer;
