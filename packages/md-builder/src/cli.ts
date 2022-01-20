#!/usr/bin/env node

import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import * as toml from 'toml';
import { Config } from './entities/config';

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

process.stdin.on('data', (data: Buffer): void => {
  child.stdin.write(data);
});

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

child.on('close', (code: number): void => {
  const configPath: string = path.join(process.argv.slice(3)[0] || '.', 'book.toml');
  const config: Config = getConfig(configPath);
  addBaseInHtmlIfNotExist(config.buildDir, config.baseHref);
  process.exit(code);
});

function replaceName(data: Buffer | string): string {
  return data
    .toString('utf8')
    .replaceAll('mdbook-mac', 'md-builder')
    .replaceAll('mdbook-linux', 'md-builder')
    .replaceAll('mdbook-win.exe', 'md-builder')
    .replaceAll('mdbook', 'md-builder')
    .replaceAll('md-builder v0.4.15\n', '')
    .replaceAll('Mathieu David <mathieudavid@mathieudavid.org>\n', '')
    .replaceAll('The source code for mdBook is available at: https://github.com/rust-lang/mdBook\n', '');
}

function addBaseInHtmlIfNotExist(buildDir: string, baseHref: string): void {
  const files: fs.Dirent[] = fs.readdirSync(buildDir, { withFileTypes: true });

  for (const file of files) {
    if (file.isDirectory()) {
      addBaseInHtmlIfNotExist(path.join(buildDir, file.name), baseHref);
    } else if (path.extname(file.name) === '.html') {
      const filePath: string = path.join(buildDir, file.name);
      let fileStr: string = fs.readFileSync(filePath, 'utf8');

      if (fileStr.includes('<base href=') === false) {
        fileStr = fileStr.replaceAll('<meta charset="UTF-8">', `<meta charset="UTF-8">\n<base href="${baseHref}">\n`);
      }

      fs.writeFileSync(filePath, fileStr, 'utf8');
    }
  }
}

function getConfig(tomlPath: string): Config {
  const tomlString: string = fs.readFileSync(tomlPath, 'utf8');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const config: any = toml.parse(tomlString);

  return {
    buildDir: process.env['MDBOOK_BOOK__BUILD_DIR'] ?? config.book?.['build-dir'] ?? '.',
    baseHref: process.env['MDBOOK_OUTPUT__HTML__SITE_URL'] ?? config['output']?.['html']?.['site-url'] ?? '/',
  };
}
