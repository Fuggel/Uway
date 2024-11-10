export function toGermanDate(params: { isoDate: string | undefined; showTimeOnly?: boolean }) {
    if (!params.isoDate) return;

    const date = new Date(params.isoDate);

    return date.toLocaleString(
        "de-DE",
        params.showTimeOnly
            ? {
                  hour: "2-digit",
                  minute: "2-digit",
              }
            : {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
              }
    );
}
