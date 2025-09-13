import { spawn } from 'child_process';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Function to spawn a process with logging
function spawnProcess(command, args, name) {
  const proc = spawn(command, args, {
    stdio: 'pipe',
    shell: true,
    cwd: __dirname,
  });

  proc.stdout.on('data', (data) => {
    console.log(`[${name}] ${data.toString().trim()}`);
  });

  proc.stderr.on('data', (data) => {
    console.error(`[${name}] ${data.toString().trim()}`);
  });

  proc.on('close', (code) => {
    console.log(`[${name}] Process exited with code ${code}`);
  });

  return proc;
}

// Start the frontend
const frontend = spawnProcess('npm', ['run', 'dev'], 'Frontend');

// Start the backend
const backend = spawnProcess('npm', ['run', 'dev'], 'Backend');

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nGracefully shutting down...');
  frontend.kill();
  backend.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nGracefully shutting down...');
  frontend.kill();
  backend.kill();
  process.exit(0);
});