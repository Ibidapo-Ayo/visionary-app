const { spawn } = require('child_process');

const args = process.argv.slice(2);

const expoArgs = ['expo', 'start', ...args];
const command = 'npx';

const env = {
  ...process.env,
  EXPO_NO_DEPENDENCY_VALIDATION: '1',
};

const child = spawn(command, expoArgs, {
  stdio: 'inherit',
  env,
  shell: process.platform === 'win32',
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});

child.on('error', (error) => {
  console.error('Failed to start Expo:', error);
  process.exit(1);
});
