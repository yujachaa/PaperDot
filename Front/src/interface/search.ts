export interface HitItem {
  _id: string;
  _source: {
    original_json: {
      title: {
        ko: string;
      };
      authors: string;
      year: string;
    };
  };
}

export interface PaperSearchResponse {
  total: number;
  paperSearchResponseList: SearchResultPaper[];
}

export interface SearchResultPaper {
  id: number;
  abstractText: {
    ko: string;
    en: string | null;
  };
  title: {
    ko: string;
    en: string;
  };
  authors: string[];
  year: string;
  cnt: number;
  bookmark: boolean;
}
