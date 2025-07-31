import {saveAs} from "file-saver";

const logDbName = "BlocksemblerLogDB"
const logDbVersion = 1

export const logEvent = (type: string, payload: any = {}): void => {
    const data = window.localStorage?.getItem("blocksembler-data-usage-consent");

    if (data && data === "false") {
        return;
    }

    if (!data || data !== "true") {
        return;
    }

    let ts = new Date().toUTCString();
    let event = {type, ts, payload};

    let open = indexedDB.open(logDbName, logDbVersion);

    open.onupgradeneeded = (e: IDBVersionChangeEvent): void => {
        let db = open.result;
        if (e.oldVersion < 1) {
            db.createObjectStore('messages', {autoIncrement: true});
        }
    }

    open.onerror = (e: Event): void => {
        console.log(e);
    }

    open.onsuccess = (): void => {
        let db = open.result;

        const trans = db.transaction('messages', 'readwrite');
        const objectStore = trans.objectStore('messages');
        const request = objectStore.add(event);

        request.onerror = (e: Event): void => {
            console.log(e);
        };
    }
}

export const deleteLogData = (): void => {
    let request = indexedDB.open(logDbName, logDbVersion);

    request.onsuccess = (): void => {
        let db = request.result;
        db.transaction('messages', 'readwrite').objectStore('messages').clear();
    }
}

export const downloadLogData = (): void => {
    let open = indexedDB.open(logDbName, logDbVersion);

    open.onerror = (e: Event): void => {
        console.log(e);
    }

    open.onsuccess = (): void => {
        let db = open.result;

        const transaction = db.transaction('messages', 'readonly');
        const store = transaction.objectStore('messages');
        const request = store.getAll();

        request.onsuccess = function () {
            saveAs(new Blob([JSON.stringify(request.result)]), `log-data-${Date.now()}.json`);
        };
    }
}