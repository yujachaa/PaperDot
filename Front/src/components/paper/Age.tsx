import { ResponsiveBar } from '@nivo/bar';
import React, { useEffect, useState } from 'react';
import { getPaperStatistics } from '../../apis/paper';
type AgeProps = {
  paperId: number;
};

const Age: React.FC<AgeProps> = ({ paperId }) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await getPaperStatistics(paperId);

        const defaultAgeGroups = [
          { age: '10대', cnt: 0, cntColor: '#344BFD' },
          { age: '20대', cnt: 0, cntColor: '#344BFD' },
          { age: '30대', cnt: 0, cntColor: '#344BFD' },
          { age: '40대', cnt: 0, cntColor: '#344BFD' },
          { age: '50대 이상', cnt: 0, cntColor: '#344BFD' },
        ];

        const ageData = response.aggregations.age_aggs.buckets.map((bucket: any) => ({
          age: bucket.key === '50' ? `${bucket.key}대 이상` : `${bucket.key}대`,
          cnt: bucket.doc_count,
          cntColor: '#344BFD',
        }));

        const mergedData = defaultAgeGroups.map((group) => {
          const found = ageData.find((d: any) => d.age === group.age);
          return found ? { ...group, cnt: found.cnt } : group;
        });

        const maxCnt = Math.max(...mergedData.map((d) => d.cnt));
        const finalData = mergedData.map((d) => ({
          ...d,
          cntColor: d.cnt === maxCnt ? '#FF955A' : '#344BFD',
        }));

        setData(finalData);
      } catch (error) {
        console.error('통계 데이터 가져오기 오류:', error);
      }
    };

    fetchStatistics();
  }, [paperId]);

  return (
    <div className="w-full h-[20rem]">
      <ResponsiveBar
        data={data}
        keys={['cnt']}
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
        barAriaLabel={(e) => e.id + ': ' + e.formattedValue + ' in age group: ' + e.indexValue}
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
