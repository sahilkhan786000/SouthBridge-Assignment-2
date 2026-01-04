export function log(step: string) {
  const time = new Date().toISOString();
  console.log(`[${time}] ${step}`);
}

export function warn(message: string) {
  console.warn(`-> ${message} <-`);
}

export function success(message: string) {
  console.log(`-> ${message} <-`);
}
