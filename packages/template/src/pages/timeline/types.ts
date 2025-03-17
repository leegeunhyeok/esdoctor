import type { HookTrace } from '@esdoctor/types';

export type TimelineData = {
  start: number;
  end: number;
  duration: number;
  name: string;
  type: string;
  data: HookTrace['data'];
  result: HookTrace['result'];
};
