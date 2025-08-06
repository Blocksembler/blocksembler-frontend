const storageKey = "blocksembler-local-storage";

export const save = function (data: any): void {
    window.localStorage?.setItem(storageKey, JSON.stringify(data));
};

export const load = function (): any {
    const data = window.localStorage?.getItem(storageKey);
    return data ? JSON.parse(data) : undefined;
};
