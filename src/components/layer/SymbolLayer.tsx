import React from "react";
import { ShapeSource, SymbolLayer as Layer } from "@rnmapbox/maps";

interface SymbolLayerProps {
    sourceId: string;
    layerId: string;
    coordinates: number[];
    iconImage: string | any[];
    properties?: any;
    iconSize?: number | any[];
    style?: any;
}

export default function SymbolLayer({
    sourceId,
    layerId,
    coordinates,
    iconImage,
    properties = {},
    iconSize,
    style,
}: SymbolLayerProps) {
    return (
        <ShapeSource
            id={sourceId}
            shape={{
                type: "Feature",
                properties,
                geometry: {
                    type: "Point",
                    coordinates,
                },
            }}
        >
            <Layer
                id={layerId}
                style={{
                    ...style,
                    iconImage,
                    iconSize: iconSize ?? 0.5,
                }}
            />
        </ShapeSource>
    );
};