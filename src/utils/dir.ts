import path from 'path';

/**
 * Get the project root directory.
 *
 * @returns string - The project directory
 */
export function projectDir() {
  return path.resolve(__dirname, '../../');
}
