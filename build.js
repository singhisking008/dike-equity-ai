#!/usr/bin/env node

import { execSync } from 'child_process';

try {
  console.log('Starting Vite build...');
  
  // Use npx to run vite build
  execSync('npx vite build', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
