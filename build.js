#!/usr/bin/env node

import { build } from 'vite';

const buildConfig = {
  root: '.',
  configFile: './vite.config.js',
  mode: 'production',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
};

try {
  await build(buildConfig);
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
