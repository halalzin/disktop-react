import fs from 'node:fs';
import path from 'node:path';
import { transformSync } from 'esbuild';

const rootDir = path.resolve('src');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return [fullPath];
  });
}

function stripCssComments(content) {
  return content.replace(/\/\*[\s\S]*?\*\//g, '');
}

for (const file of walk(rootDir)) {
  const ext = path.extname(file);
  if (!['.js', '.jsx', '.css'].includes(ext)) continue;

  const content = fs.readFileSync(file, 'utf8');
  let next = content;

  if (ext === '.css') {
    next = stripCssComments(content);
  } else {
    const result = transformSync(content, {
      loader: ext === '.jsx' ? 'jsx' : 'js',
      format: 'esm',
      target: 'esnext',
      legalComments: 'none',
      minify: false,
      sourcemap: false,
    });
    next = result.code;
  }

  fs.writeFileSync(file, next, 'utf8');
}

console.log('Comments removed from src files.');
