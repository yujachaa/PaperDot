export interface PaperDetailData {
  id: number;
  title: {
    ko: string | null;
    en: string | null;
  };
  author: string[];
  year: string;
  docId: string;
  abstractText: {
    ko: string | null;
    en: string | null;
  };
  keyword: string[];
  cnt: number;
  bookmark: boolean;
  category: number;
  relation: {
    id: number;
    title: string;
    author: string[];
    year: number;
    keyword: string[];
  }[];
}

export interface Rank {
  paperId: number;
  title: string;
  rank: number;
}
