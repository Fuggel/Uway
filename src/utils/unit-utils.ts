export function formatLength(length: number): string {
    if (length >= 1000) {
        const kilometers = length / 1000;
        return `${kilometers.toFixed(1)} km`;
    }
    return `${length.toFixed(0)} m`;
}
