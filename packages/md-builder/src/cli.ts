#!/usr/bin/env node

import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process';

const child: ChildProcessWithoutNullStreams = spawn('../mdbook-mac', process.argv.slice(2));

child.stdout.on('data', (data: unknown): void => {
  // eslint-disable-next-line no-console
  console.log(`stdout:\n${data}`);
});

child.stderr.on('data', (data: unknown): void => {
  console.error(`stderr: ${data}`);
});

child.on('error', (error: Error): void => {
  console.error(`error: ${error.message}`);
});

child.on('close', (code: number): void => {
  // eslint-disable-next-line no-console
  console.log(`child process exited with code ${code}`);
});
