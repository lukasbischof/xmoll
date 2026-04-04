import "./scripts/components/App";

if (location.host.includes("localhost")) {
    new EventSource("/esbuild").addEventListener("change", () => location.reload());
    window.debug = true;
}

declare global {
    interface Window {
        debug: boolean;
    }
}
