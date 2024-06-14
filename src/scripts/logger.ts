// biome-ignore lint/suspicious/noExplicitAny: Adhere to console.log signature
export const log = (message?: any, ...optionalParams: any[]): void => {
    if (message && typeof message === "string") {
        console.log(`[Xmoll] ${message}`, ...optionalParams);
        return;
    }

    console.log(message, ...optionalParams);
};

// biome-ignore lint/suspicious/noExplicitAny: Adhere to console.log signature
export const debug = (message?: any, ...optionalParams: any[]): void => {
    if (!window.debug) {
        return;
    }

    log(message, ...optionalParams);
};
