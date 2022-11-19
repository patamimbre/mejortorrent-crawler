import enquirer from 'enquirer';
// @ts-ignore
const { Confirm, Input, MultiSelect } = enquirer;

export const acceptDownloadItems = async (count?: number) => new Confirm({
  name: 'download',
  message: `Descargar ${count ?? 'todos los'} elementos seleccionados?`,
  initial: true
}).run();

export const inputSearchTerm = async () => new Input({
  name: 'search',
  message: 'Termino de busqueda',
}).run();

export const inputDownloadDirectory = async (defaultPath?: string) => new Input({
  name: 'download',
  message: 'Directorio',
  default: defaultPath,
}).run();

export const selectItemsToDownload = async (choices: {title: string}[]) => new MultiSelect({
  name: 'items to download',
  message: 'Selecciona los elementos a descargar',
  choices,
}).run();
