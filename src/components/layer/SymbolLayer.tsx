import React from "react";
import { ShapeSource, SymbolLayer as Layer } from "@rnmapbox/maps";

interface SymbolLayerProps {
    sourceId: string;
    layerId: string;
    coordinates: number[];
    onPress?: () => void;
    properties?: any;
    style?: {
        textField?: string | any[];
        textSize?: number | any[];
        textColor?: string | any[];
        textOffset?: number[] | any[];
        iconImage?: string | any[];
        iconAllowOverlap?: boolean | any[];
        iconRotationAlignment?: "map" | "viewport" | any[];
        iconPitchAlignment?: "map" | "viewport" | any[];
        iconSize?: number | any[];
        iconRotate?: number | any[];
    };
    belowLayerId?: string;
    aboveLayerId?: string;
}

export default function SymbolLayer({
    sourceId,
    layerId,
    coordinates,
    onPress,
    properties = {},
    style,
    belowLayerId,
    aboveLayerId,
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
            onPress={onPress}
        >
            <Layer
                id={layerId}
                style={{
                    iconImage: style?.iconImage ?? "marker-15",
                    iconAllowOverlap: true,
                    iconSize: style?.iconSize ?? 0.5,
                    iconRotate: style?.iconRotate ?? 0,
                    ...style,
                }}
                belowLayerID={belowLayerId ?? undefined}
                aboveLayerID={aboveLayerId ?? undefined}
            />
        </ShapeSource>
    );
}
