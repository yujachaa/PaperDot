import React from 'react';
import { ResponsivePie } from '@nivo/pie';

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const GenderRatio: React.FC = () => {
  const data = [
    {
      id: '남자',
      label: '남자',
      value: 60,
      // color: 'hsl(233, 98%, 60%)',
    },
    {
      id: '여자',
      label: '여자',
      value: 40,
      // color: 'hsl(3, 70%, 50%)',
    },
  ];
  return (
    <div className="w-full h-[20rem]">
      <ResponsivePie
        data={data}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        activeOuterRadiusOffset={8}
        colors={{ scheme: 'category10' }}
        borderWidth={1}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.2]],
        }}
        enableArcLinkLabels={false}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: 'color',
          modifiers: [['darker', 2]],
        }}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            justify: false,
            translateX: 0,
            translateY: 50,
            itemWidth: 60,
            itemHeight: 20,
            itemsSpacing: 0,
            symbolSize: 20,
            itemDirection: 'left-to-right',
          },
        ]}
      />
    </div>
  );
};

export default GenderRatio;
