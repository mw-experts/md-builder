#!/usr/bin/env node

import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import * as os from 'node:os';
import * as path from 'node:path';

const binaries: Record<string, string> = {
  darwin: 'mdbook-mac',
  linux: 'mdbook-linux',
  win32: 'mdbook-win.exe',
};

const binName: string | undefined = binaries[os.platform()];
if (binName === undefined) {
  throw new Error(`Can't determine current operating system. Given platform is: ${os.platform()}`);
}

// eslint-disable-next-line unicorn/prefer-module
const child: ChildProcessWithoutNullStreams = spawn(path.resolve(__dirname, '..', binName), process.argv.slice(2));

child.stdout.on('data', (data: Buffer): void => {
  // eslint-disable-next-line no-console
  console.log('\u001B[34m%s\u001B[0m', replaceName(data));
});

child.stderr.on('data', (data: Buffer): void => {
  console.error('\u001B[31m%s\u001B[0m', replaceName(data));
});

child.on('error', (error: Error): void => {
  console.error('\u001B[31m%s\u001B[0m', replaceName(error.message));
});

function replaceName(data: Buffer | string): string {
  return data
    .toString('utf8')
    .replaceAll('mdbook v0.4.15\n', '')
    .replaceAll('Mathieu David <mathieudavid@mathieudavid.org>\n', '')
    .replaceAll('The source code for mdBook is available at: https://github.com/rust-lang/mdBook\n', '')
    .replaceAll('mdbook-mac', 'md-builder')
    .replaceAll('mdbook-linux', 'md-builder')
    .replaceAll('mdbook-win.exe', 'md-builder')
    .replaceAll('mdbook', 'md-builder');
}
