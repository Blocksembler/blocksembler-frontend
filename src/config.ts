export const BACKEND_DISABLED = window.env["BACKEND_DISABLED"] === "true";
export const BACKEND_API_URL = window.env["BACKEND_API_URL"] || "http://localhost:8081";
export const DEFAULT_ARCHITECTURE = window.env["DEFAULT_ARCHITECTURE"] || "anna";
export const LOG_SYNC_BATCH_SIZE = window.env["LOG_SYNC_BATCH_SIZE"] ? parseInt(window.env["LOG_SYNC_BATCH_SIZE"]) : 1_000;
export const LOG_SYNC_INTERVAL = window.env["LOG_SYNC_INTERVAL"] ? parseInt(window.env["LOG_SYNC_INTERVAL"]) : 10_000;

type ResourceLink = { name: string, url: string };

let nav_items: Array<ResourceLink>;
try {
    nav_items = JSON.parse(window.env["RESOURCE_LINKS"]);
} catch (e) {
    console.error("Failed to parse RESOURCE_LINKS from environment variable:", e);
    nav_items = [];
}

export const RESOURCE_LINKS = nav_items;