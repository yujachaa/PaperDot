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
