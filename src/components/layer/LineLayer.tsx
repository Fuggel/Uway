import { LineLayer as Layer, ShapeSource } from "@rnmapbox/maps";

import { COLORS } from "@/constants/colors-constants";

interface LineLayerProps<T> {
    sourceId: string;
    layerId: string;
    coordinates: number[][];
    properties?: T;
    style?: any;
}

const LineLayer = <T,>({ sourceId, layerId, coordinates, properties, style }: LineLayerProps<T>) => {
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
            />
        </ShapeSource>
    );
};

export default LineLayer;
