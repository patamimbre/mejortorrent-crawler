import chalk from 'chalk';

export function exit(...messages: string[]) {
  messages && errorLog(...messages);
  process.exit(0);
}

export function errorLog(...messages: string[]) {
  console.error(chalk.red(messages));
}

export function successLog(...messages: string[]) {
  console.log(chalk.green(messages));
}

export function infoLog(...messages: string[]) {
  console.log(chalk.blue(messages));
}