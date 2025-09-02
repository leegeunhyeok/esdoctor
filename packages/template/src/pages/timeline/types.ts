import type { HookTrace } from '@esdoctor/types';

export type TimelineData = {
  label: string;
  start: number;
  end: number;
  duration: number;
  name: string;
  type: string;
  result: HookTrace['result'];
  args: HookTrace['args'];
  options: HookTrace['options'];
  data: HookTrace['data'];
};
