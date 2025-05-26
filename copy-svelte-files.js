// copy-svelte-files.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Make sure the destination directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Copy Svelte components from src to dist
const copySvelteFiles = () => {
  // Create the target directory
  const targetDir = path.resolve(__dirname, 'dist', 'svelteComponents');
  ensureDirectoryExists(targetDir);

  // Source file
  const sourceFile = path.resolve(__dirname, 'src', 'svelteComponents', 'GetListener.svelte');
  const destFile = path.resolve(targetDir, 'GetListener.svelte');

  // Check if source file exists
  if (fs.existsSync(sourceFile)) {
    fs.copyFileSync(sourceFile, destFile);
    console.log(`Copied ${sourceFile} to ${destFile}`);
  } else {
    console.error(`Source file not found: ${sourceFile}`);
  }
};

copySvelteFiles();
