import { LABELS } from './constants.js';
import { Dataset, createCheerioRouter } from 'crawlee';
import { Item, ItemEntry, SingleEntry } from './types.js';

export const router = createCheerioRouter();

router.addDefaultHandler(async ({ log }) => {
    log.info('Default handler');
});

router.addHandler(LABELS.SEARCH_RESULTS, async ({ request, $, crawler }) => {
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
        label: LABELS.ENTRY,
        userData: { entry: { search, ...entry } as Item},
    })) as any);
});

router.addHandler(LABELS.ENTRY, async ({ request, $ }) => {
    const { entry } = request.userData;

    // Two different layouts for the same page depending on the type of content
    // First try to extract from the single entry layout
    let entries = [{ downloadUrl: $('div.flex.items-center.just a').attr('href')} as SingleEntry]

    // If the single entry layout doesn't exist, try to extract from the multiple entries layout
    if (entries.length === 0) {
        entries = $('tbody.bg-mejortorrent-green tr').map((_, el) => {
            const $el = $(el);
            const id = $el.find('td:first-child').text().trim();
            const episodes = $el.find('td:nth-child(2)').text().trim().replace(/\s-/, '');
            const date = $el.find('td:nth-child(3)').text().trim();
            const key = $el.find('td:nth-child(4) p').text();
            const downloadUrl = $el.find('td:nth-child(5) a').attr('href');

            return { id, episodes, date, key, downloadUrl } as ItemEntry;
        }).get();
    }

    const data = {
        ...entry,
        entries,
    } as Item;

    await Dataset.pushData(data);
});