import { spawn } from 'child_process';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Colors for console output
const colors = {
  frontend: '\x1b[36m', // Cyan
  backend: '\x1b[32m',  // Green
  reset: '\x1b[0m'      // Reset
};

function spawnProcess(command, args, name, cwd) {
  console.log(`${colors[name]}Starting ${name}...${colors.reset}`);
  
  const proc = spawn(command, args, {
    stdio: 'pipe',
    shell: true,
    cwd: resolve(__dirname, cwd)
  });

  proc.stdout.on('data', (data) => {
    console.log(`${colors[name]}[${name}] ${data.toString().trim()}${colors.reset}`);
  });

  proc.stderr.on('data', (data) => {
    console.error(`${colors[name]}[${name}] ${data.toString().trim()}${colors.reset}`);
  });

  proc.on('close', (code) => {
    if (code !== 0) {
      console.log(`${colors[name]}[${name}] Process exited with code ${code}${colors.reset}`);
    }
  });

  return proc;
}

console.log('Starting development servers...');

// Start frontend (Vite)
const frontend = spawnProcess('npm', ['run', 'dev:frontend'], 'frontend', '.');

// Start backend (Node/Fastify)
const backend = spawnProcess('npm', ['run', 'dev'], 'backend', 'backend');

// Handle process termination
function cleanup() {
  console.log('\nShutting down development servers...');
  frontend.kill();
  backend.kill();
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);