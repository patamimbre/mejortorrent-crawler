export type Item = {
    search: string;
    title: string;
    url: string;
    type: string;
    entries?: ItemEntry[];
}

export type ItemEntry = {
    id: string;
    episodes: string;
    date: string;
    key: string;
    downloadUrl: string;
}