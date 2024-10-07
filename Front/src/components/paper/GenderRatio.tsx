import React, { useEffect, useState } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { getPaperStatistics } from '../../apis/paper';
import noData from '../../assets/images/nodata.png';
import styles from './Statistics.module.scss';

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
          id: bucket.key === 'MALE' ? '남자' : '여자',
          label: bucket.key === 'MALE' ? '남자' : '여자',
          value: bucket.doc_count,
          color: bucket.key === 'MALE' ? '#344BFD' : '#F68D2B',
        }));
        console.log('젠더 데이터: ', formattedData);
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
        <div className={styles.noData}>
          <img
            src={noData}
            alt="데이터없음"
            style={{ width: '50px' }}
          />
          <div>통계 데이터가 부족합니다.</div>
        </div>
      )}
    </div>
  );
};

export default GenderRatio;
