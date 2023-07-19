import { projectDir } from './dir';

/**
 * Get the version of the application from the package.json file.
 *
 * @returns string
 */
export function getAppVersion() {
  const packageJson = require(projectDir() + '/package.json');
  return packageJson.version;
}
