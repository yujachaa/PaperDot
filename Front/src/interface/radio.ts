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
    id: 10633,
    title: '미술관 관람객의 방문결정요인과 행동의도에 관한 연구',
    author: '나선후, 여영숙',
    year: '2019',
  },
];
