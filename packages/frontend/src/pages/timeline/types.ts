export type TimelineData = {
  start: number;
  end: number;
  duration: number;
  name: string;
  type: string;
  data: Record<string, unknown>;
  code?: string;
};
