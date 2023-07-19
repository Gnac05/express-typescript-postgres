import { App } from '@/app';

// This import is necessary to initialize the config
import '@config';

/** Application Instance */
const app = new App();

// Start the application
app.listen();
