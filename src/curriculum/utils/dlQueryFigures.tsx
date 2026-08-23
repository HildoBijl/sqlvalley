import { ComponentProps } from 'react';
import { DL } from '@sqlvalley/ui';
import { FigureExampleRAQuery } from './raQueryFigures';

type Props = ComponentProps<typeof FigureExampleRAQuery>;

export function FigureExampleDLQuery({ Component = DL, ...rest }: Props) {
  return <FigureExampleRAQuery {...(rest as Props)} Component={Component} />;
}
