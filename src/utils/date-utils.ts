export function toGermanDate(isoDate: string | undefined) {
    if (!isoDate) return;

    const date = new Date(isoDate);

    return date.toLocaleString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
