import Path from 'path';
import got from 'got';
import { createWriteStream, promises } from 'fs';
import * as _ from 'radash'
import { errorLog, exit, infoLog, successLog } from './utils.js';

const PARALLEL_DOWNLOADS = 5;
export const downloadTorrents = async (urls: string[], folder: string) => {
  infoLog(`Starting download of torrents:`, ...urls);

  // create folder if it doesn't exist
  const [err, __] = await _.try(promises.mkdir)(folder, { recursive: true });
  if (err) exit(`Error creating folder ${folder}`, err.message);

  return _.parallel(PARALLEL_DOWNLOADS, urls, async (url) => {
    infoLog(`Downloading ${url}`);
    const [err, path] = await _.try(downloadFile)(url, folder);
    if (err) errorLog('Error downloading file', url);
    else successLog(`${path} downloaded`);
    return path;
  });
};

export const downloadFile = async (url: string, folder: string) => {
    const filename = url.split('/').pop() as string;
    const path = Path.normalize(Path.resolve(folder, filename));
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