import React from "react";
import { ShapeSource, SymbolLayer as Layer } from "@rnmapbox/maps";

interface SymbolLayerProps<T> {
    sourceId: string;
    layerId: string;
    coordinates: number[];
    onPress?: () => void;
    properties?: T;
    style?: any;
    belowLayerId?: string;
    aboveLayerId?: string;
}

export default function SymbolLayer<T>({
    sourceId,
    layerId,
    coordinates,
    onPress,
    properties,
    style,
    belowLayerId,
    aboveLayerId,
}: SymbolLayerProps<T>) {
    return (
        <ShapeSource
            id={sourceId}
            shape={{
                type: "Feature",
                properties: properties ?? {},
                geometry: {
                    type: "Point",
                    coordinates,
                },
            }}
            onPress={onPress}
        >
            <Layer
                id={layerId}
                style={{
                    iconImage: "marker-15",
                    iconAllowOverlap: true,
                    iconSize: 0.5,
                    iconRotate: 0,
                    ...style,
                }}
                belowLayerID={belowLayerId ?? undefined}
                aboveLayerID={aboveLayerId ?? undefined}
            />
        </ShapeSource>
    );
}
