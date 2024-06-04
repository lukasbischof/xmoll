import "./scripts/stimulus";

if (location.host.includes("localhost")) {
  new EventSource("/esbuild").addEventListener("change", () => location.reload());
}
