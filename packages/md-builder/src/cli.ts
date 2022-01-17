#!/usr/bin/env node

import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import * as os from 'node:os';
import * as path from 'node:path';

const binaries: Record<string, string> = {
  darwin: 'mdbook-mac',
  linux: 'mdbook-linux',
  win32: 'mdbook-win.exe',
}

const binName: string | undefined = binaries[os.platform()];
if (binName === undefined) {
  throw new Error(`Can't determine current operating system. Given platform is: ${os.platform()}`);
}

const child: ChildProcessWithoutNullStreams = spawn(path.resolve(__dirname, '..', binName), process.argv.slice(2));

child.stdout.on('data', (data: unknown): void => {
  // eslint-disable-next-line no-console
  console.log(`stdout:\n${data}`);
});

child.stderr.on('data', (data: unknown): void => {
  console.error(`stderr:\n${data}`);
});

child.on('error', (error: Error): void => {
  console.error(`error:\n${error.message}`);
});

child.on('close', (code: number): void => {
  // eslint-disable-next-line no-console
  console.log(`child process exited with code ${code}`);
});
