import chalk from 'chalk';

export function exit(message?: string) {
  message && errorLog(message);
  process.exit(0);
}

export function errorLog(...messages: string[]) {
  console.error(chalk.red(messages));
}

export function successLog(...messages: string[]) {
  console.log(chalk.green(messages));
}