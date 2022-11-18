import { BASE_URL, LABELS } from './constants.js';
import { CheerioCrawler } from 'crawlee';
import { router } from './routes.js';

export default async function crawl(search: string) {
  const crawler = new CheerioCrawler({
    requestHandler: router,
  });

  await crawler.run([{
    url: `${BASE_URL}/busqueda?q=${search.replace(' ', '+')}`,
    label: LABELS.SEARCH,
    userData: { search },
  }]);
}

