import { ResponsiveBar } from '@nivo/bar';
import React, { useEffect, useRef, useState } from 'react';
import { getPaperStatistics } from '../../apis/paper';
import noData from '../../assets/images/nodata.png';
import styles from './Statistics.module.scss';
import usePaperBookmark from '../../zustand/paperBookmark';

type DegreeData = {
  DEGREE: string;
  UNDERUNIV: number;
  UNIV: number;
  BACHELOR: number;
  MASTER: number;
  DOCTOR: number;
  NONE: number;
};

type DegreeProps = {
  paperId: number;
};

const Degree: React.FC<DegreeProps> = ({ paperId }) => {
  const [degreeData, setDegreeData] = useState<DegreeData[]>([]);
  const [notEnoughData, setNotEnoughData] = useState<boolean>(false);
  const isBookmarked = usePaperBookmark((state) => state.isBookmarked);

  const noneInitialValue = useRef(0);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await getPaperStatistics(paperId);
        const degreeBuckets = response.aggregations.degree_aggs.buckets;
        if (degreeBuckets.length === 0) {
          setNotEnoughData(true);
          return;
        } else {
          setNotEnoughData(false);
        }

        let maxCount = 0;
        degreeBuckets.forEach((bucket: { key: string; doc_count: number }) => {
          if (bucket.doc_count > maxCount) {
            maxCount = bucket.doc_count;
          }
        });

        noneInitialValue.current = Math.ceil(maxCount / 10) * 10;

        const formattedData: DegreeData[] = [
          {
            DEGREE: '중고등학생',
            UNDERUNIV: 0,
            UNIV: 0,
            BACHELOR: 0,
            MASTER: 0,
            DOCTOR: 0,
            NONE: noneInitialValue.current,
          },
          {
            DEGREE: '대학생',
            UNDERUNIV: 0,
            UNIV: 0,
            BACHELOR: 0,
            MASTER: 0,
            DOCTOR: 0,
            NONE: noneInitialValue.current,
          },
          {
            DEGREE: '석사',
            UNDERUNIV: 0,
            UNIV: 0,
            BACHELOR: 0,
            MASTER: 0,
            DOCTOR: 0,
            NONE: noneInitialValue.current,
          },
          {
            DEGREE: '박사',
            UNDERUNIV: 0,
            UNIV: 0,
            BACHELOR: 0,
            MASTER: 0,
            DOCTOR: 0,
            NONE: noneInitialValue.current,
          },
          {
            DEGREE: '교수',
            UNDERUNIV: 0,
            UNIV: 0,
            BACHELOR: 0,
            MASTER: 0,
            DOCTOR: 0,
            NONE: noneInitialValue.current,
          },
        ];

        degreeBuckets.forEach((bucket: any) => {
          formattedData.forEach((item) => {
            switch (bucket.key) {
              case 'DOCTOR':
                if (item.DEGREE === '교수') {
                  item.DOCTOR = bucket.doc_count;
                  item.NONE -= bucket.doc_count;
                }
                break;
              case 'MASTER':
                if (item.DEGREE === '박사') {
                  item.MASTER = bucket.doc_count;
                  item.NONE -= bucket.doc_count;
                }
                break;
              case 'BACHELOR':
                if (item.DEGREE === '석사') {
                  item.BACHELOR = bucket.doc_count;
                  item.NONE -= bucket.doc_count;
                }
                break;
              case 'UNDERUNIV':
                if (item.DEGREE === '중고등학생') {
                  item.UNDERUNIV = bucket.doc_count;
                  item.NONE -= bucket.doc_count;
                }
                break;
              case 'UNIV':
                if (item.DEGREE === '대학생') {
                  item.UNIV = bucket.doc_count;
                  item.NONE -= bucket.doc_count;
                }
                break;
              default:
                break;
            }
          });
        });
        console.log('학위 통계 데이터:', formattedData);
        setDegreeData(formattedData);
      } catch (error) {
        console.error('학위 통계 데이터를 가져오는 중 오류 발생:', error);
      }
    };
    setTimeout(() => {
      fetchStatistics();
    }, 2000);
    console.log('북마크 랜더링');
  }, [paperId, noneInitialValue, isBookmarked]);

  return (
    <div className="w-full h-[20rem]">
      {notEnoughData ? (
        <div className={styles.noData}>
          <img
            src={noData}
            alt="데이터없음"
            style={{ width: '50px' }}
          />
          <div>통계 데이터가 부족합니다.</div>
        </div>
      ) : (
        <ResponsiveBar
          data={degreeData}
          keys={['DOCTOR', 'MASTER', 'BACHELOR', 'UNIV', 'UNDERUNIV', 'NONE']}
          indexBy="DEGREE"
          margin={{ top: 50, right: 50, bottom: 50, left: 70 }}
          padding={0.2}
          layout="horizontal"
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={({ id }) => (id === 'NONE' ? 'hsla(218, 22%, 93%, 1)' : '#344BFD')}
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
          barAriaLabel={(e) => e.id + ': ' + e.formattedValue + ' in degree: ' + e.indexValue}
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
                : {id === 'NONE' ? noneInitialValue.current - value : value}
              </strong>
            </div>
          )}
        />
      )}
    </div>
  );
};

export default Degree;
