const logDbName = "BlocksemblerLogDB"
const logDbVersion = 1

export const logEvent = (type, payload = {}) => {
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

    open.onupgradeneeded = (e) => {
        let db = e.target.result;
        if (e.oldVersion < 1) {
            db.createObjectStore('messages', {autoIncrement: true});
        }
    }

    open.onerror = (e) => {
        console.log(e);
    }

    open.onsuccess = (e) => {
        let db = e.target.result;

        db.transaction('messages', 'readwrite').objectStore('messages').add(event).onerror = (e) => {
            console.log(e);
        };
    }
}

export const deleteLogData = () => {
    let request = indexedDB.open(logDbName, logDbVersion);

    request.onsuccess = (e) => {
        let db = e.target.result;
        db.transaction('messages', 'readwrite').objectStore('messages').clear();
    }

}

export const downloadLogData = () => {
    let open = indexedDB.open(logDbName, logDbVersion);

    open.onerror = (e) => {
        console.log(e);
    }

    open.onsuccess = (e) => {
        let db = e.target.result;

        db.transaction('messages', 'readonly').objectStore('messages').getAll().onsuccess = (e) => {
            saveAs(new Blob([JSON.stringify(e.target.result)]), `logdata-${Date.now()}.json`);
        }
    }
}