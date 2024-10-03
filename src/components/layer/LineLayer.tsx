import React from "react";
import { ShapeSource, LineLayer as Layer } from "@rnmapbox/maps";
import { COLORS } from "@/src/constants/colors-constants";

interface LineLayerProps {
    sourceId: string;
    layerId: string;
    coordinates: number[][];
    properties?: any;
    style?: any;
    belowLayerId?: string;
    aboveLayerId?: string;
}

export default function LineLayer({
    sourceId,
    layerId,
    coordinates,
    properties = {},
    style,
    belowLayerId,
    aboveLayerId,
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
                    lineColor: COLORS.secondary,
                    lineWidth: 5,
                    lineOpacity: 0.8,
                    lineCap: "round",
                    lineJoin: "round",
                    ...style,
                }}
                belowLayerID={belowLayerId ?? "user-location-layer"}
                aboveLayerID={aboveLayerId ?? undefined}
            />
        </ShapeSource>
    );
}
