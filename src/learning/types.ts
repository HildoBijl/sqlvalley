import type { ReactElement } from 'react';

export interface TabConfig {
  key: string;
  label: string;
  icon?: ReactElement | string;
  disabled?: boolean;
}
