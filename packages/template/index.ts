import assert from 'node:assert';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseHTML } from 'linkedom';
import { BUNDLE_NAME, HTML_TEMPLATE, CSS_NAME } from './shared.mjs';
import type * as esdoctor from '@esdoctor/types';

let htmlCache: string | null = null;
let bundleCache: string | null = null;
let styleCache: string | null = null;

export async function generateTemplate(metafile: esdoctor.Metafile) {
  const htmlPath = resolve(__dirname, HTML_TEMPLATE);
  const bundlePath = resolve(__dirname, BUNDLE_NAME);
  const stylePath = resolve(__dirname, CSS_NAME);
  const html = htmlCache ?? (await readFile(htmlPath, 'utf-8'));
  const bundle = bundleCache ?? (await readFile(bundlePath, 'utf-8'));
  const css = styleCache ?? (await readFile(stylePath, 'utf-8'));

  htmlCache = html;
  bundleCache = bundle;

  const { document } = parseHTML(html);
  const head = document.querySelector('head');
  const script = document.querySelector('script');
  const styleLink = document.querySelector('link[rel="stylesheet"]');
  assert(head, '<head> element not found');
  assert(script, '<script> element not found');
  assert(styleLink, '<link rel="stylesheet"> element not found');

  script.removeAttribute('src');
  script.setAttribute('type', 'application/javascript');
  script.textContent = [
    `window.__esdoctorDataSource=${normalize(metafile)};`,
    bundle,
  ].join('\n');

  styleLink.remove();
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  return document.toString();
}

function normalize(metafile: esdoctor.Metafile) {
  return JSON.stringify(metafile);
}
