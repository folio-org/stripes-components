#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const generatorScript = path.join(__dirname, 'generate-readme-mdx.js');
const storybookArgs = ['dev', '-p', '9001', '-c', '.storybook', ...process.argv.slice(2)];

let storybookProcess = null;
let cleanupStarted = false;

function runNodeScript(args) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, args, { stdio: 'inherit' });

    child.on('error', () => resolve(1));
    child.on('exit', (code) => resolve(typeof code === 'number' ? code : 1));
  });
}

function shellQuote(arg) {
  if (/^[A-Za-z0-9_./:-]+$/.test(arg)) {
    return arg;
  }

  return `"${arg.replace(/"/g, '\\"')}"`;
}

async function cleanupGeneratedReadmes() {
  if (cleanupStarted) return 0;

  cleanupStarted = true;
  return runNodeScript([generatorScript, '--clean']);
}

function forwardSignalToStorybook(signal) {
  if (storybookProcess && !storybookProcess.killed) {
    storybookProcess.kill(signal);
  }
}

process.on('SIGINT', () => forwardSignalToStorybook('SIGINT'));
process.on('SIGTERM', () => forwardSignalToStorybook('SIGTERM'));

async function run() {
  const generateExitCode = await runNodeScript([generatorScript]);
  if (generateExitCode !== 0) {
    process.exit(generateExitCode);
  }

  let storybookExitCode = 0;

  try {
    storybookExitCode = await new Promise((resolve) => {
      const storybookCommand = ['storybook', ...storybookArgs].map(shellQuote).join(' ');
      storybookProcess = spawn(storybookCommand, { stdio: 'inherit', shell: true });

      storybookProcess.on('error', () => resolve(1));
      storybookProcess.on('exit', (code, signal) => {
        if (typeof code === 'number') {
          resolve(code);
          return;
        }

        resolve(signal ? 1 : 0);
      });
    });
  } finally {
    const cleanupExitCode = await cleanupGeneratedReadmes();

    if (storybookExitCode === 0 && cleanupExitCode !== 0) {
      storybookExitCode = cleanupExitCode;
    }
  }

  process.exit(storybookExitCode);
}

run();
