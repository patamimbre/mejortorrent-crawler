import Path from 'path';
import got from 'got';
import { createWriteStream } from 'fs';
import { map, parallel, retry } from 'radash'


export const downloadTorrents = async (urls: string[], folder: string) => {
  return map(urls, (url) => downloadFile(url, folder));
}

export const downloadFile = async (url: string, folder: string) => {
    const filename = url.split('/').pop() as string;
    console.log(`Downloading ${filename}...`);
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