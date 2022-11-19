import Path from 'path';
import got from 'got';
import { createWriteStream } from 'fs';
import * as _ from 'radash'
import { errorLog, successLog } from './utils.js';

const PARALLEL_DOWNLOADS = 5;
export const downloadTorrents = async (urls: string[], folder: string) => _.parallel(PARALLEL_DOWNLOADS, urls, async (url) => {
  const [err, path] = await _.try(downloadFile)(url, folder);
  if (err) errorLog('Error downloading file', url);
  else successLog(`${path} downloaded`);
  return path;
});

export const downloadFile = async (url: string, folder: string) => {
    const filename = url.split('/').pop() as string;
    const path = Path.normalize(Path.resolve(folder, filename));
    // TODO: mkdir if not exists

    const downloadStream = got.stream(url);
    const fileWriterStream = createWriteStream(path);

    downloadStream.pipe(fileWriterStream);
    await new Promise((resolve, reject) => {
      downloadStream.on('error', reject);
      fileWriterStream.on('error', reject);
      fileWriterStream.on('finish', resolve);
    });
    return path;
}