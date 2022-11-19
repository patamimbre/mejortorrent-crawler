export function exit(message?: string) {
  message ?? console.log(message);
  process.exit(0);
}
