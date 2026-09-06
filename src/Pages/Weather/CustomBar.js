import * as React from 'react';
// import { BarElement } from '@mui/x-charts/BarChart';

export function CustomBar(props) {
  const { x, y, width, height, dataIndex, dataset } = props;
  // console.log(props);
  // 🎯 Получаем только нужную запись
  const current = dataset[dataIndex];
  // console.log(current);

  // Например, берём тип осадков или индекс градиента
  // const gradientId = current.barColor === 'snow' ? 'grad-snow' : current.barColor === 'rain' ? 'grad-rain' : 'grad-mix';
  const gradientId = current.barColor;

  return <rect x={x} y={y} rx={3} width={width} height={height} fill={`url(#${gradientId})`} />;
}
