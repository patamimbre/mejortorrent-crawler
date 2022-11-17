import { LABELS } from './constants.js';
import { Dataset, createCheerioRouter, KeyValueStore,  } from 'crawlee';
import { v4 as uuid } from 'uuid';

export const router = createCheerioRouter();

router.addDefaultHandler(async ({ log }) => {
    log.info('Default handler');
});

router.addHandler(LABELS.SEARCH, async ({ request, $, crawler, log }) => {
    const { search } = request.userData;

    const entries = $('div.w-full div.flex.flex-row.mb-2').map((_, el) => {
        const $el = $(el);
        const title = $el.find('a p').text();
        const url = $el.find('a').attr('href');
        const type = $el.find('span.text-xs').text();

        return { title, url, type };
    }).get();

    await crawler.addRequests(entries.map(entry => ({
        url: entry.url,
        label: LABELS.TORRENTS,
        userData: { entry: { search, ...entry }},
    })) as any);
});

router.addHandler(LABELS.TORRENTS, async ({ request, $, log }) => {
    const { entry } = request.userData;

    const entries = $('tbody.bg-mejortorrent-green tr').map((_, el) => {
        const $el = $(el);
        const id = $el.find('td:first-child').text();
        const episodes = $el.find('td:nth-child(2)').text();
        const date = $el.find('td:nth-child(3)').text();
        const key = $el.find('td:nth-child(4)').text();
        const downloadUrl = $el.find('td:nth-child(5) a').attr('href');

        return { id, episodes, date, key, downloadUrl };
    }).get();

    const cleanEntriesValue = entries.map(entry => Object.fromEntries(Object.entries(entry).map(([key, value]) => [key, value?.replace(/\n/g, '').replace(/\s-/g,'')])));

    const data = {
        ...entry,
        entries: cleanEntriesValue,
    };

    // log.info(JSON.stringify(data, null, 2));

    const dataset = await Dataset.open(entry.search);
    await dataset.pushData(data);

    // const store = await KeyValueStore.open(entry.search);
    // await store.setValue(uuid(), data);
});