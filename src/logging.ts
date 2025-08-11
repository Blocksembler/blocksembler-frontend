import {saveAs} from "file-saver";
import {db} from "@/db";
import {onMounted, onUnmounted} from "vue";

const BASE_URL = "api/v1/";
const BATCH_SIZE = window.env["LOG_SYNC_BATCH_SIZE"] ? parseInt(window.env["LOG_SYNC_BATCH_SIZE"]) : 1_000;
const SYNC_INTERVAL = window.env["LOG_SYNC_INTERVAL"] ? parseInt(window.env["LOG_SYNC_INTERVAL"]) : 10_000;

let timer: number | undefined;

export const logEvent = (type: string, payload: any = {}): void => {
    const consentGiven = window.localStorage?.getItem("blocksembler-tracking-consent");

    if (!consentGiven || consentGiven === "false") {
        return;
    }

    let jsonString: string = JSON.stringify(payload);

    let timestamp = new Date();
    let source = "";
    let event: LogEvent = {timestamp, type, source, payload: jsonString};

    console.log(event);
    db.events.add(event);
}

export const deleteLogData = (): void => {
    db.events.clear();
}

export const downloadLogData = (): void => {
    db.events.toArray().then(events => {
        let blob: Blob = new Blob([JSON.stringify(events)])
        saveAs(blob, `log-data-${Date.now()}.json`)
    });
}

async function flushOnce() {
    try {
        const tan = window.localStorage?.getItem("blocksembler-tan-code")

        if (!tan) {
            console.warn("Skipped syncing log data to server because no tan code was found in local storage.");
            return;
        }

        let endpoint = BASE_URL;

        if (!endpoint.endsWith("/")) {
            endpoint += "/";
        }

        endpoint += `logging/${tan}`;

        const batch: Array<LogEvent> = await db.events.orderBy('id').limit(BATCH_SIZE).toArray();

        fetch(endpoint, {
            method: 'POST', // HTTP method
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(batch)            // convert JS object → JSON string
        })
            .then(async response => {
                if (!response.ok) {
                    throw new Error(`Failed to sync log entries! HTTP Status Code: ${response.status}`);
                }

                await db.events.bulkDelete(batch.map(e => e.id));
            })
            .catch(err => {
                console.error('Request failed:', err);
            });
    } catch (e) {
        console.error("Failed to sync log data to server", e);
    }
}

function schedule() {
    clearSchedule();
    timer = setInterval(flushOnce, SYNC_INTERVAL) as unknown as number;
}

const clearSchedule = (): void => {
    if (timer) {
        clearTimeout(timer);
        timer = undefined;
    }
}

const start = (): void => {
    schedule();
}

const stop = (): void => {
    clearSchedule();

    window.removeEventListener('online', flushOnce);
}

export const initLogSync = (): void => {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stop(); // Stop the interval when the tab loses focus
        } else {
            start(); // Start the interval when the tab gains focus
        }
    });

    onMounted(start);
    onUnmounted(stop);
}