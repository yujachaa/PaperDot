import React, { useState } from 'react';
import styles from './BestPaper.module.scss';

type Category = '인문/사회' | '공학' | '자연과학' | '의약학' | '예체능' | '전체';

const categories: Category[] = ['인문/사회', '공학', '자연과학', '의약학', '예체능', '전체'];

const papers: Record<Category, string[]> = {
  '인문/사회': [
    '인공 지능에서 인공 감정으로',
    '썸타기와 어장관리에 대한 철학적 고찰',
    '훈민정음 창제와 백성들의 언어생활 변화',
    '한국의 초저출산: 무엇이 원인이고 무엇이 해법인가',
    '안락사 사례로 보는 생명과 권리의 문제',
  ],
  공학: [
    '인공 지능에서 인공 감정으로2',
    '썸타기와 어장관리에 대한 철학적 고찰2',
    '훈민정음 창제와 백성들의 언어생활 변화2',
    '한국의 초저출산: 무엇이 원인이고 무엇이 해법인가2',
    '안락사 사례로 보는 생명과 권리의 문제2',
  ],
  자연과학: [
    '인공 지능에서 인공 감정으로3',
    '썸타기와 어장관리에 대한 철학적 고찰3',
    '훈민정음 창제와 백성들의 언어생활 변화3',
    '한국의 초저출산: 무엇이 원인이고 무엇이 해법인가3',
    '안락사 사례로 보는 생명과 권리의 문제3',
  ],
  의약학: [
    '인공 지능에서 인공 감정으로4',
    '썸타기와 어장관리에 대한 철학적 고찰4',
    '훈민정음 창제와 백성들의 언어생활 변화4',
    '한국의 초저출산: 무엇이 원인이고 무엇이 해법인가4',
    '안락사 사례로 보는 생명과 권리의 문제4',
  ],
  예체능: [
    '인공 지능에서 인공 감정으로5',
    '썸타기와 어장관리에 대한 철학적 고찰5',
    '훈민정음 창제와 백성들의 언어생활 변화5',
    '한국의 초저출산: 무엇이 원인이고 무엇이 해법인가5',
    '안락사 사례로 보는 생명과 권리의 문제5',
  ],
  전체: [
    '인공 지능에서 인공 감정으로6',
    '썸타기와 어장관리에 대한 철학적 고찰6',
    '훈민정음 창제와 백성들의 언어생활 변화6',
    '한국의 초저출산: 무엇이 원인이고 무엇이 해법인가6',
    '안락사 사례로 보는 생명과 권리의 문제6',
  ],
};

const BestPaper: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('인문/사회');

  return (
    <div className={styles.bestPaper}>
      <div className="text-xl font-bold ml-3">Best 논문</div>
      <p className="text-base ml-3">최근 가장 많이 찾은 논문입니다.</p>
      <div className="w-full overflow-x-auto">
        <div className="flex justify-between mt-4 w-full px-2 text-lg mobile:min-w-[24rem] mobile:text-base mobile:gap-1">
          {categories.map((category) => (
            <div
              key={category}
              className={`cursor-pointer ${styles.tab} ${
                selectedCategory === category ? styles.activeTab : ''
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </div>
          ))}
        </div>
        <hr className="w-full mobile:min-w-[24rem]" />
      </div>
      <ul className="flex flex-col items-start w-full gap-3 ml-1 mr-1">
        {papers[selectedCategory].map((paper, index) => (
          <li
            key={index}
            className="text-lg ml-3 cursor-pointer overflow-hidden whitespace-nowrap text-ellipsis max-w-[95%] mobile:text-base"
          >
            <span className="mr-1">0{index + 1}</span> {paper}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BestPaper;
