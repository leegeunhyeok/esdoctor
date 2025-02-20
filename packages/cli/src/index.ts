import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import colors from 'picocolors';
import { generateTemplate } from '@esdoctor/template';
import type { Metafile } from '@esdoctor/types';

const DEFAULT_REPORT_NAME = 'report.html';

const argv = yargs(hideBin(process.argv))
  .version(false)
  .usage('Usage: $0 <metafile>')
  .command('$0 <metafile>', 'Generate an repo', (yargs) => {
    yargs.positional('metafile', {
      describe: 'The metafile to load',
      type: 'string',
    });
  })
  .option('name', {
    alias: 'n',
    type: 'string',
    describe: `The report file name of the project (default: '${DEFAULT_REPORT_NAME}')`,
    default: DEFAULT_REPORT_NAME,
  })
  .demandCommand(1, 'You must provide a metafile')
  .parse();

const cwd = process.cwd();
const { metafile: metafileName, name: reportName } = argv as unknown as {
  metafile: string;
  name: string;
};

try {
  const metafilePath = resolve(cwd, metafileName);
  const metafileContent = await readFile(metafilePath, 'utf-8');
  const metafile = JSON.parse(metafileContent);

  const requiredKeys: (keyof Metafile)[] = [
    'alerts',
    'buildOptions',
    'duration',
    'environment',
    'metafile',
    'moduleStatus',
    'traceList',
  ];

  const isValid = Object.keys(metafile).every((key) =>
    requiredKeys.includes(key as keyof Metafile),
  );

  if (isValid === false) {
    throw new Error('Invalid metafile');
  }

  const template = await generateTemplate(metafile);
  const reportPath = resolve(cwd, reportName);
  await writeFile(reportPath, template, 'utf-8');

  console.log(`Report generated: ${colors.blue(reportPath)}`);
} catch (error) {
  console.error(
    process.env.DEBUG === '1'
      ? error
      : colors.red(error.message ?? 'unknown error'),
  );
  process.exit(1);
}
