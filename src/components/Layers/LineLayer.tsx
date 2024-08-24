import React from "react";
import { ShapeSource, LineLayer as Layer } from "@rnmapbox/maps";
import { COLORS } from "@/src/constants/colors-constants";

interface LineLayerProps {
    sourceId: string;
    layerId: string;
    coordinates: number[][];
}

export default function LineLayer({ sourceId, layerId, coordinates }: LineLayerProps) {
    return (
        <ShapeSource
            id={sourceId}
            shape={{
                type: "Feature",
                properties: {},
                geometry: {
                    type: "LineString",
                    coordinates,
                },
            }}
        >
            <Layer
                id={layerId}
                style={{
                    lineColor: COLORS.secondary,
                    lineWidth: 5,
                    lineOpacity: 0.8,
                }}
            />
        </ShapeSource>
    );
};