interface LogEvent {
    id?: number,
    timestamp: Date,
    source: string,
    type: string,
    payload: any
}