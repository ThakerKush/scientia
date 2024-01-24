import { app } from './App';
import loaders from './utils/loader';
import closeWithGrace from 'close-with-grace';
import teardown from './utils/taredown';

async function startServer() {
  await loaders(app);
  app.listen();
}

closeWithGrace({ delay: 500 }, async function ({ signal, err, manual }) {
  if (err) {
    console.error(err);
  }
  await teardown();
  console.log(`Server is closed!
  
  
  Shutting Down....`);
});

startServer();
