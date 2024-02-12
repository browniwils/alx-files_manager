import { existsSync, readFileSync } from 'fs';

/**
 * Get environment variables.
 */
const getEnv = () => {
  const env = process.env.npm_lifecycle_event || 'dev';
  const envPath = env.includes('test') || env.includes('cover') ? '.env.test' : '.env';

  if (existsSync(envPath)) {
    const data = readFileSync(envPath, 'utf-8').trim().split('\n');

    for (const line of data) {
      const delimPosition = line.indexOf('=');
      const variable = line.substring(0, delimPosition);
      const value = line.substring(delimPosition + 1);
      process.env[variable] = value;
    }
  }
};

export default getEnv;
