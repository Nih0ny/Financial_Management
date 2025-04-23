export interface NestedNode {
  [key: string]: NestedNode | string[] | string | undefined;
  total?: string;
  ids?: string[];
  inPercent?: string;
}
