import { ResponsiveBar } from '@nivo/bar';
import React from 'react';

const data = [
  {
    degree: '교수',
    underuniv: 0,
    underunivColor: '#344BFD',

    univ: 0,
    univColor: '#344BFD',

    bachelor: 0,
    bachelorColor: '#344BFD',

    master: 0,
    masterColor: '#344BFD',

    doctor: 60,
    doctorColor: '#344BFD',

    none: 40,
    noneColor: 'hsla(218, 22%, 93%, 1)',
  },
  {
    degree: '박사',
    underuniv: 0,
    underunivColor: '#344BFD',

    univ: 0,
    univColor: '#344BFD',

    bachelor: 0,
    bachelorColor: '#344BFD',

    master: 70,
    masterColor: '#344BFD',

    doctor: 0,
    doctorColor: '#344BFD',

    none: 30,
    noneColor: 'hsla(218, 22%, 93%, 1)',
  },

  {
    degree: '석사',
    underuniv: 0,
    underunivColor: '#344BFD',

    univ: 0,
    univColor: '#344BFD',

    bachelor: 90,
    bachelorColor: '#344BFD',

    master: 0,
    masterColor: '#344BFD',

    doctor: 0,
    doctorColor: '#344BFD',

    none: 10,
    noneColor: 'hsla(218, 22%, 93%, 1)',
  },
  {
    degree: '대학생',
    underuniv: 0,
    underunivColor: '#344BFD',

    univ: 55,
    univColor: '#344BFD',

    bachelor: 0,
    bachelorColor: '#344BFD',

    master: 0,
    masterColor: '#344BFD',

    doctor: 0,
    doctorColor: '#344BFD',

    none: 45,
    noneColor: 'hsla(218, 22%, 93%, 1)',
  },

  {
    degree: '중고등학생',
    underuniv: 10,
    underunivColor: '#344BFD',

    univ: 0,
    univColor: '#344BFD',

    bachelor: 0,
    bachelorColor: '#344BFD',

    master: 0,
    masterColor: '#344BFD',

    doctor: 0,
    doctorColor: '#344BFD',

    none: 90,
    noneColor: 'hsla(218, 22%, 93%, 1)',
  },
];

const Degree: React.FC = () => {
  return (
    <div className="w-full h-[20rem]">
      <ResponsiveBar
        data={data}
        keys={['underuniv', 'univ', 'bachelor', 'master', 'doctor', 'none']}
        indexBy="degree"
        margin={{ top: 50, right: 50, bottom: 50, left: 70 }}
        padding={0.2}
        layout="horizontal"
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={({ id, data }) => String((data as any)[`${id}Color`])}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={null}
        axisLeft={{
          tickSize: 0,
          tickPadding: 5,
          tickRotation: 0,
          truncateTickAt: 0,
        }}
        enableGridY={false}
        enableLabel={false}
        labelSkipWidth={12}
        labelTextColor={{
          from: 'color',
          modifiers: [['darker', 1.6]],
        }}
        legends={[]}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={(e) => e.id + ': ' + e.formattedValue + ' in country: ' + e.indexValue}
        tooltip={({ id, value, indexValue }) => (
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
              : {id === 'none' ? 100 - value : value}
            </strong>
          </div>
        )}
      />
    </div>
  );
};

export default Degree;
