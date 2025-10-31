interface LogEvent {
    id?: number,
    tan_code: string,
    timestamp: Date,
    source: string | null,
    type: string | null,
    payload: string,
    exercise_id: string | null
}