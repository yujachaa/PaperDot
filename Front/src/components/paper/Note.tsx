import React, { useEffect, useState } from 'react';
import copyIcon from '../../assets/images/copy.svg';
import copiedIcon from '../../assets/images/copied.svg';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import NoteSkeleton from './NoteSkeleton';

interface NoteProps {
  paperId: number;
}

const summaryText = `
# 인스타그램 이용자의 조건부 자아존중감이 우울 경험에 미치는 영향: 인스타그램 내 상향 비교의 매개효과를 중심으로

## 목차
1. [한문단 요약](#한문단-요약)
2. [핵심주제](#핵심주제)
3. [타임라인](#타임라인)
    - [서론](#서론)
    - [이론적 배경](#이론적-배경)
    - [연구방법](#연구방법)
    - [연구결과](#연구결과)
    - [논의](#논의)
4. [참고문헌](#참고문헌)

---

## 한문단 요약
> 본 연구는 **인스타그램 사용자의 조건부 자아존중감**이 상향 비교를 통해 **우울에 미치는 영향**을 분석하였으며, 319명의 사용자를 대상으로 설문 조사를 진행하였다. 연구 결과, 조건부 자아존중감이 높은 사용자가 상향 비교를 자주 하고, 이는 우울감을 유의미하게 증가시킨다는 사실을 밝혔다.

---

## 핵심주제
<details>
<summary>1. 조건부 자아존중감이 높을수록 상향 비교를 통해 우울이 증가한다</summary>

**조건부 자아존중감**은 외부 기준을 충족할 때 유지되는 자존감으로, 이를 가진 사람들은 인스타그램에서 **상향 비교**를 빈번하게 수행한다. 연구에서는 상향 비교가 우울 증가와 **0.53**의 높은 상관관계를 보였으며, 이로 인해 조건부 자아존중감이 높을수록 우울감을 더 많이 느낀다.
</details>

<details>
<summary>2. 상향 비교는 조건부 자아존중감과 우울 사이의 주요 매개 변수다</summary>

상향 비교는 조건부 자아존중감과 우울 사이에서 중요한 **매개 효과**를 가지며, 이 관계에서 상향 비교의 매개효과는 **0.245**로 확인되었다. 이는 인스타그램에서 상향 비교가 우울을 심화시키는 주요 원인임을 시사한다.
</details>

---

## 타임라인

### 📘 서론
- 인스타그램의 인기와 사용이 늘어나며, 사용자 간 **상향 비교**가 빈번하게 발생.
- 상향 비교가 **우울감**과 어떻게 연결되는지를 탐구하는 배경 설정.
- 조건부 자아존중감과 우울의 상관관계를 분석하기 위한 가설 제시.

### 🔍 이론적 배경
- **조건부 자아존중감**은 외부 기준을 충족하는 경우에만 자아존중감을 유지하는 개념.
- **상향 비교**는 타인을 자신보다 우월하게 보는 경향이며, 이 과정에서 사용자의 심리적 영향 분석.
- 연구에서 상향 비교가 우울을 증가시키는 요소로 작용하는 이론적 배경을 설명.

### 📝 연구방법
- **319명**의 인스타그램 사용자(평균 연령 **29.7세**, 여성 **51.1%**)를 대상으로 설문조사 진행.
- **조건부 자아존중감 척도**(17문항), **상향 비교 척도**(6문항), **우울 척도**(20문항)를 사용하여 설문 분석.
- 데이터 분석에 **SPSS**와 **PROCESS Macro**를 사용하여 매개 효과를 검증.

### 📊 연구결과
- 조건부 자아존중감과 상향 비교의 **상관계수는 0.39**, 상향 비교와 우울의 상관계수는 **0.53**으로 확인.
- 조건부 자아존중감이 높은 사용자는 **상향 비교**를 통해 우울을 더 자주 경험.
- 상향 비교가 조건부 자아존중감과 우울 사이의 **매개효과 0.245**로 확인됨.

### 💬 논의
- 상향 비교가 **우울감**을 증가시키는 주요 변수로 확인되었으며, 조건부 자아존중감이 높은 사용자에게 더 큰 영향을 미침.
- 연구의 한계로 **다양한 연령대**와 **문화적 배경**을 포함한 추가 연구 필요성을 강조.

---

## 참고문헌
1. **Bailey & Ricciardelli (2010)** - 외모 관련 상향 비교와 자아존중감, 우울감의 관계를 연구.
2. **Brown & Tiggemann (2016)** - 인스타그램 상의 유명인 이미지가 여성의 기분과 신체 이미지에 미치는 영향.
3. **Feinstein et al. (2013)** - 페이스북에서의 부정적 사회 비교와 우울 증상 간의 관계를 분석.
4. **Hwang (2019)** - 인스타그램 상의 상향 비교가 우울에 미치는 영향을 연구.
5. **Lakey et al. (2014)** - 조건부 자아존중감이 우울과 자살 행동에 미치는 영향을 분석한 연구.
`;

const Note: React.FC<NoteProps> = ({ paperId }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      //요약노트 로딩하기
      setTimeout(() => {
        console.log('3초후');
        setIsLoaded(true);
      }, 2000);
    }
  }, []);

  const getCopy = async () => {
    //클립보드에 md파일 text 복사하기
    try {
      await navigator.clipboard.writeText(summaryText);
      console.log('요약노트가 클립보드에 복사되었습니다!');
    } catch (error) {
      console.error('요약노트 복사 실패:', error);
    }
    setIsCopied(true);
  };

  const getNote = () => {
    //요약노트 가져오는 로직 만들기
    console.log(paperId);
  };

  getNote();

  return isLoaded ? (
    <>
      {isCopied ? (
        <div
          className="flex w-full justify-end items-center gap-[0.3125rem] cursor-pointer text-light-text font-bold opacity-80"
          onClick={getCopy}
        >
          <img
            src={copiedIcon}
            alt="복사됨"
            className="w-[1.2rem]"
          />
          <p>복사되었습니다!</p>
        </div>
      ) : (
        <div
          className="flex w-full justify-end items-center gap-[0.3125rem] cursor-pointer text-light-text opacity-80"
          onClick={getCopy}
        >
          <img
            src={copyIcon}
            alt="복사"
            className="w-[1.2rem]"
          />
          <p>복사하기</p>
        </div>
      )}
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{summaryText}</ReactMarkdown>
    </>
  ) : (
    <NoteSkeleton />
  );
};

export default Note;
