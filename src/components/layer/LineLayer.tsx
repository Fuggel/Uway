import React from "react";
import { ShapeSource, LineLayer as Layer } from "@rnmapbox/maps";
import { COLORS } from "@/src/constants/colors-constants";

interface LineLayerProps {
    sourceId: string;
    layerId: string;
    coordinates: number[][];
    properties?: any;
    style?: any;
}

export default function LineLayer({
    sourceId,
    layerId,
    coordinates,
    properties = {},
    style,
}: LineLayerProps) {
    return (
        <ShapeSource
            id={sourceId}
            shape={{
                type: "Feature",
                properties,
                geometry: {
                    type: "LineString",
                    coordinates,
                },
            }}
        >
            <Layer
                id={layerId}
                style={{
                    iconAllowOverlap: true,
                    lineColor: COLORS.secondary,
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