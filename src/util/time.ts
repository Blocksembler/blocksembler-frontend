export let formatTime = (timeInMs: number | null) => {
    if (timeInMs === null) {
        return '0m 0s';
    }

    const seconds = timeInMs / 1000;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
}