import { Dataset, entries } from 'crawlee';
import crawl from "./crawler.js";
import { acceptDownloadItems, inputDownloadDirectory, inputSearchTerm, selectItemsToDownload } from "./cli.js";
import { downloadTorrents } from './download.js';

const search = await inputSearchTerm();

await crawl(search);

const dataset = await Dataset.open(search);
const items = (await dataset.getData()).items;

if (items.length === 0) {
  console.log('No se han encontrado resultados');
  process.exit(0);
}

// sort items by title
items.sort((a, b) => a.title.localeCompare(b.title));

// TODO: fix duplicated entries when crawling. For now, we filter them out
const uniqueItems = items.filter((item, index, self) => index === self.findIndex((t) => t.title === item.title));

const selectedIds = await selectItemsToDownload(uniqueItems.map(({ title }) => ({ title })));

const directory = await inputDownloadDirectory();

const accept = await acceptDownloadItems(selectedIds.length);

if (!accept) {
  process.exit(0);
}

const urls = selectedIds.map((id: string) => uniqueItems.find((item) => item.title === id)?.entries).flat().map((entry: any) => entry.downloadUrl);
await downloadTorrents(urls, directory)