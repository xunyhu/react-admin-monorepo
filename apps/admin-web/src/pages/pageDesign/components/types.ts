import type { ReactNode } from 'react';

export type BlockDefinition<P extends Record<string, any>> = {
  title: string;
  description: string;
  defaultProps: P;
  render: (props: P) => ReactNode;
  renderEditor: (props: P, onChange: (patch: Partial<P>) => void) => ReactNode;
};

export type PageBlock = {
  id: string;
  type: string;
  props: Record<string, any>;
};

export type PageSchema = {
  blocks: PageBlock[];
};

