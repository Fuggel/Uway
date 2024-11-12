import { SymbolLayer as Layer, ShapeSource } from "@rnmapbox/maps";

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

const SymbolLayer = <T,>({ sourceId, layerId, coordinates, onPress, properties, style }: SymbolLayerProps<T>) => {
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
            />
        </ShapeSource>
    );
};

export default SymbolLayer;
