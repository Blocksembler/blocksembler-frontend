import {saveAs} from "file-saver";
import {db} from "@/db";
import {onMounted, onUnmounted} from "vue";
import {BACKEND_API_URL, BACKEND_DISABLED, LOG_SYNC_BATCH_SIZE, LOG_SYNC_INTERVAL} from "@/config";


let timer: number | undefined;

export const logEvent = (type: string, payload: any = {}): void => {
    const consentGiven = window.localStorage?.getItem("blocksembler-tracking-consent");
    const tanCode = window.localStorage?.getItem("blocksembler-tan-code");

    if (!tanCode) {
        return
    }

    if (!consentGiven || consentGiven === "false") {
        return;
    }

    let jsonString: string = JSON.stringify(payload);

    let timestamp = new Date();
    let source = "";
    let event: LogEvent = {
        "tan_code": tanCode,
        "timestamp": timestamp,
        "type": type,
        "source": source,
        "payload": jsonString,
        "exercise_id": null
    };

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
    if (BACKEND_DISABLED) return;

    try {
        const tan = window.localStorage?.getItem("blocksembler-tan-code")

        if (!tan) {
            console.warn("Skipped syncing log data to server because no tan code was found in local storage.");
            return;
        }

        let endpoint = BACKEND_API_URL;

        if (!endpoint.endsWith("/")) {
            endpoint += "/";
        }

        endpoint += `logging-events/${tan}`;

        const batch: Array<LogEvent> = await db.events.orderBy('id').limit(LOG_SYNC_BATCH_SIZE).toArray();

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(batch)
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
    timer = setInterval(flushOnce, LOG_SYNC_INTERVAL) as unknown as number;
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
            stop();
        } else {
            start();
        }
    });

    onMounted(start);
    onUnmounted(stop);
}