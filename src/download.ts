import Path from 'path';
import got from 'got';
import { createWriteStream } from 'fs';

export const downloadTorrents = async (urls: string[], folder: string) => {
  for (const url of urls) {
    await downloadFile(url, folder);
  }
}

export const downloadFile = async (url: string, folder: string) => {
    const filename = url.split('/').pop() as string;
    console.log(`Downloading ${filename}...`);
    const path = Path.normalize(Path.resolve(folder, filename));
    // TODO: mkdir if not exists

    const downloadStream = got.stream(url);
    const fileWriterStream = createWriteStream(path);

    downloadStream.pipe(fileWriterStream);
}