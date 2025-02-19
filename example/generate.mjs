import { readFile, writeFile } from 'node:fs/promises';
import { generateTemplate } from '@esdoctor/template';

const metafile = await readFile('esdoctor.json', 'utf-8');
const template = await generateTemplate(JSON.parse(metafile));

await writeFile('template.html', template, 'utf-8');
