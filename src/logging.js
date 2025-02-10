const logDbName = "BlocksemblerLogDB"
const logDbVersion = 1

export const logEvent = (type, data = {}) => {
    data.ts = new Date().toUTCString();
    let event = {type, data};

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

        console.log(event);
        db.transaction('messages', 'readwrite').objectStore('messages').add(event).onerror = (e) => {
            console.log(e);
        };
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