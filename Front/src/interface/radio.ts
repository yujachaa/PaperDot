export type Category = '인문/사회' | '공학' | '자연과학' | '의약학' | '예체능';
export interface Radio {
  id: number;
  title: string;
  author: string;
  year: string;
}

export const RadioLists = [
  {
    id: 5966,
    title: "『논리-철학 논고』의 '논리적 공간'에 관하여",
    author: '박정일',
    year: '2016',
  },
  {
    id: 14036,
    title: '축대칭 캐비테이터에서 발생하는 자연 초월공동과 항력 특성에 대한 연구',
    author: '김지혜, 정소원, 안병권, 전윤호',
    year: '2016',
  },
  {
    id: 2,
    title: 'Paeonol에 의한 표피줄기세포 활성화',
    author: '김도형, 김효진, 여혜린, 이천구, 이상화',
    year: '2016',
  },
  {
    id: 36216,
    title:
      'Bee Venom (Apis Mellifera) an Effective Potential Alternative to Gentamicin for Specific Bacteria Strains - Bee Venom an Effective Potential for Bacteria-',
    author: 'Zolfagharian Hossein, Mohajeri Mohammad, Babaie Mahdi',
    year: '2016',
  },
  {
    id: 35244,
    title: '인상주의 회화에서 색채 표현의 기호적 담론 연구 -인상주의 작품 분석을 중심으로 -',
    author: '류주현',
    year: '2015',
  },
];
