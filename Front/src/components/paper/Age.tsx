import { ResponsiveBar } from '@nivo/bar';
import React from 'react';

const data = [
  {
    age: '10대',
    cnt10: 123,
    cnt10Color: '#344BFD',

    cnt20: 0,
    cnt20Color: '#344BFD',

    cnt30: 0,
    cnt30Color: '#344BFD',

    cnt40: 0,
    cnt40Color: '#344BFD',

    cnt50: 0,
    cnt50Color: '#344BFD',
  },
  {
    age: '20대',
    cnt10: 0,
    cnt10Color: '#344BFD',

    cnt20: 161,
    cnt20Color: '#344BFD',

    cnt30: 0,
    cnt30Color: '#344BFD',

    cnt40: 0,
    cnt40Color: '#344BFD',

    cnt50: 0,
    cnt50Color: '#344BFD',
  },
  {
    age: '30대',
    cnt10: 0,
    cnt10Color: '#344BFD',

    cnt20: 0,
    cnt20Color: '#344BFD',

    cnt30: 200,
    cnt30Color: '#FF955A',

    cnt40: 0,
    cnt40Color: '#344BFD',

    cnt50: 0,
    cnt50Color: '#344BFD',
  },
  {
    age: '40대',
    cnt10: 0,
    cnt10Color: '#344BFD',

    cnt20: 0,
    cnt20Color: '#344BFD',

    cnt30: 0,
    cnt30Color: '#344BFD',

    cnt40: 79,
    cnt40Color: '#344BFD',

    cnt50: 0,
    cnt50Color: '#344BFD',
  },
  {
    age: '50대 이상',
    cnt10: 0,
    cnt10Color: '#344BFD',

    cnt20: 0,
    cnt20Color: '#344BFD',

    cnt30: 0,
    cnt30Color: '#344BFD',

    cnt40: 0,
    cnt40Color: '#344BFD',

    cnt50: 110,
    cnt50Color: '#344BFD',
  },
];

const Age: React.FC = () => {
  return (
    <div className="w-full h-[20rem]">
      <ResponsiveBar
        data={data}
        keys={['cnt10', 'cnt20', 'cnt30', 'cnt40', 'cnt50']}
        indexBy="age"
        margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
        padding={0.5}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={({ id, data }) => String((data as any)[`${id}Color`])}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 5,
          tickRotation: -34,
          truncateTickAt: 0,
        }}
        axisLeft={null}
        enableGridY={false}
        enableLabel={false}
        enableTotals={true}
        labelSkipWidth={12}
        labelTextColor={{
          from: 'color',
          modifiers: [['darker', 1.6]],
        }}
        legends={[]}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={(e) => e.id + ': ' + e.formattedValue + ' in country: ' + e.indexValue}
        tooltip={({ value, indexValue }) => (
          <div
            style={{
              padding: 12,
              backgroundColor: 'white',
              boxShadow: 'rgba(0, 0, 0, 0.25) 0px 1px 2px',
              borderRadius: '5px',
            }}
          >
            {indexValue}
            <strong
              style={{
                color: 'black',
              }}
            >
              : {value}
            </strong>
          </div>
        )}
      />
    </div>
  );
};

export default Age;
