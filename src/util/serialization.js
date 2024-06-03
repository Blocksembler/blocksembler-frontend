const storageKey = "blocksembler-local-storage";

export const save = function (data) {
    window.localStorage?.setItem(storageKey, JSON.stringify(data));
};

export const load = function () {
    const data = window.localStorage?.getItem(storageKey);
    return data ? JSON.parse(data) : undefined;
};
