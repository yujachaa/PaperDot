package gomgook.paperdot.paper.repository;


import gomgook.paperdot.paper.entity.PaperSimpleDocument;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;
import java.util.Optional;

public interface PapersimpleESRepository extends ElasticsearchRepository<PaperSimpleDocument, Long> {
    Optional<PaperSimpleDocument> findById(Long id);

    @Query("{\"terms\": {\"_id\": ?0}}")
    Optional<List<PaperSimpleDocument>> findAllByIdIn(List<Long> ids);

    @Query("{\"terms\": {\"doc_id\": ?0}}")
    Optional<List<PaperSimpleDocument>> findAllByDocIdIn(List<String> docIds);


    // Match 쿼리와 from, size 설정
    //@Query("{ \"match\": { \"original_json.title.ko\": \"?0\"  } }")
    //@Query("{ \"bool\": { \"should\": [ { \"term\": { \"original_json.title.ko\": \"?0\" } }, { \"term\": { \"original_json.title.ko.keyword\": \"?0\" } } ] } }")
    //@Query("{ \"bool\": { \"should\": [ { \"match_phrase_prefix\": { \"original_json.title.ko\": \"?0\" } }] } }")

    @Query("""
{
  "bool": {
    "must": [
      {
        "exists": {
          "field": "original_json.abstract"
        }
      },
      {
        "match_phrase_prefix": {
          "original_json.title.ko": "?0"
        }
      }
    ]
  }
}
""")
    Optional<List<PaperSimpleDocument>> findByOriginalJsonTitle(String searchTerm);

}
