import { LABELS } from './constants.js';
import { Dataset, createCheerioRouter } from 'crawlee';

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
        const id = $el.find('td:first-child').text().trim();
        const episodes = $el.find('td:nth-child(2)').text().trim();
        const date = $el.find('td:nth-child(3)').text().trim();
        const key = $el.find('td:nth-child(4) p').text();
        const downloadUrl = $el.find('td:nth-child(5) a').attr('href');

        return { id, episodes, date, key, downloadUrl };
    }).get();

    const data = {
        ...entry,
        entries,
    };

    const dataset = await Dataset.open(entry.search);
    await dataset.pushData(data);
});