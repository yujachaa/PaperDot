import React, { useEffect, useState } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { getPaperStatistics } from '../../apis/paper';

type GenderRatioProps = {
  paperId: number;
};

const GenderRatio: React.FC<GenderRatioProps> = ({ paperId }) => {
  const [genderData, setGenderData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await getPaperStatistics(paperId);

        const genderBuckets = response.aggregations.gender_aggs.buckets;

        const formattedData = genderBuckets.map((bucket: any) => ({
          id: bucket.key === 'male' ? '남자' : '여자',
          label: bucket.key === 'male' ? '남자' : '여자',
          value: bucket.doc_count,
          color: bucket.key === 'male' ? '#007BFF' : '#FF955A',
        }));

        setGenderData(formattedData);
      } catch (error) {
        console.error('성별 통계 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchStatistics();
  }, [paperId]);

  return (
    <div className="w-full h-[20rem]">
      {genderData.length > 0 ? (
        <ResponsivePie
          data={genderData}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          activeOuterRadiusOffset={8}
          colors={({ data }) => data.color}
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
          arcLabel={(d) => `${d.value}`}
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
      ) : (
        <p>로딩 중...</p>
      )}
    </div>
  );
};

export default GenderRatio;
