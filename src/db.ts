import Dexie, {EntityTable} from 'dexie';

const logDbName = "BlocksemblerLogDB"
const logDbVersion = 1
const eventsSchema = '++id, timestamp, source, payload';

const db = new Dexie(logDbName) as Dexie & {
    events: EntityTable<
        LogEvent,
        'id'
    >;
};

// Schema declaration:
db.version(logDbVersion).stores({
    events: eventsSchema
});

export {db};
