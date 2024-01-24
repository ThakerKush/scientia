import { App } from '../App';

function sleep(ms: number) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}

export default async function loaders(app: App) {
  let retries = 1;
  while (retries <= 5) {
    try {
      await app.connectToDB();

      break;
    } catch (error) {
      await sleep(5000);
      retries++;
      if (retries >= 5) {
        throw error;
      }
    }
  }
}
