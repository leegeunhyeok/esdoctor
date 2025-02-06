import os from 'node:os';
import type { Environment } from './types.js';

let cachedValue: Environment | undefined;

export function getEnvironment(): Environment {
  return cachedValue
    ? cachedValue
    : (cachedValue = {
        platform: os.platform(),
        arch: os.arch() as Environment['arch'],
        cpu: getCpuInfo(),
        cwd: process.cwd(),
      });
}

function getCpuInfo() {
  const cpus = os.cpus();

  return cpus.reduce(
    (acc, cpu) => ({
      ...acc,
      [cpu.model]: (acc[cpu.model] || 0) + 1,
    }),
    {} as Environment['cpu'],
  );
}
