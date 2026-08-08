import { cp, mkdir, rm, stat } from 'node:fs/promises';

const files = ['index.html', 'styles.css', 'app.mjs'];
await rm('dist', { recursive: true, force: true });
await mkdir('dist/src', { recursive: true });
for (const file of files) {
  await cp(file, `dist/${file}`);
  console.log(`${file} ${Number((await stat(file)).size).toLocaleString()} B`);
}
for (const file of ['core.mjs', 'scenarios.mjs']) {
  await cp(`src/${file}`, `dist/src/${file}`);
  console.log(`src/${file} ${Number((await stat(`src/${file}`)).size).toLocaleString()} B`);
}
console.log('Built dist/');
