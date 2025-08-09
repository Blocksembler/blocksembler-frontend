import {saveAs} from "file-saver";
import {db} from "@/db";

export const logEvent = (type: string, payload: any = {}): void => {
    const data = window.localStorage?.getItem("blocksembler-data-usage-consent");

    if (data && data === "false") {
        return;
    }

    if (!data || data !== "true") {
        return;
    }

    let timestamp = new Date();
    let source = "";
    let event: LogEvent = {timestamp, type, source, payload};

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