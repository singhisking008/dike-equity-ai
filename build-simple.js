#!/usr/bin/env node

import { execSync } from 'child_process';

try {
  console.log('Starting Vite build...');
  
  // Try different build methods in order
  const methods = [
    'npx vite build',
    'vite build',
    './node_modules/.bin/vite build'
  ];
  
  for (const method of methods) {
    try {
      console.log(`Trying: ${method}`);
      execSync(method, { stdio: 'inherit', cwd: process.cwd() });
      console.log('Build completed successfully!');
      process.exit(0);
    } catch (error) {
      console.log(`Method failed: ${method}`);
      console.log('Trying next method...');
    }
  }
  
  console.error('All build methods failed');
  process.exit(1);
  
} catch (error) {
  console.error('Build script error:', error);
  process.exit(1);
}
