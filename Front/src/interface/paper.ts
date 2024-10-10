export interface PaperDetailData {
  id: number;
  title: {
    ko: string;
    en: string | null;
  };
  authors: string[];
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
  relation: RelationData[];
}

export interface RelationData {
  id: number;
  title: string;
  authors: string[];
  year: number;
  keywords: string[];
  cnt: number | null;
  bookmark: boolean;
}

export interface Rank {
  paperId: number;
  title: string;
  rank: number;
}
