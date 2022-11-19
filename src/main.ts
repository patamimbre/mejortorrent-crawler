import { alphabetical, flat, select } from 'radash'
import { Dataset, KeyValueStore, purgeDefaultStorages } from 'crawlee';
import crawl from "./crawler.js";
import { acceptDownloadItems, inputDownloadDirectory, inputSearchTerm, selectItemsToDownload } from "./cli.js";
import { downloadTorrents } from './download.js';
import { exit } from './utils.js';

async function main() {
  const search = await inputSearchTerm();
  await crawl(search);

  const dataset = await Dataset.open();
  await purgeDefaultStorages();

  const items = alphabetical((await dataset.getData()).items, x => x.title);
  if (items.length === 0) exit('No items found');

  const selectedTitles = await selectItemsToDownload(items.map(({ title }) => ({ title })));
  if (!selectedTitles.length) exit('No items selected');

  const { DOWNLOAD_DIR } = await KeyValueStore.getInput() as { DOWNLOAD_DIR: string };
  const directory = await inputDownloadDirectory(DOWNLOAD_DIR);

  const accept = await acceptDownloadItems(selectedTitles.length);
  if (!accept) exit('Download cancelled');

  const urls = flat(
    select(
      items,
      (item) => item.entries.map(({ downloadUrl }: any) => downloadUrl) as string[],
      (item) => selectedTitles.includes(item.title),
    )
  )

  await downloadTorrents(urls, directory)
}

main()