package gomgook.paperdot.paper.service;

import gomgook.paperdot.exception.CustomException;
import gomgook.paperdot.exception.ExceptionResponse;
import gomgook.paperdot.paper.dto.RankResponse;
import gomgook.paperdot.paper.entity.Paper;
import gomgook.paperdot.paper.entity.PaperSimpleDocument;
import gomgook.paperdot.paper.entity.Rank;
import gomgook.paperdot.paper.repository.PaperESRepository;
import gomgook.paperdot.paper.repository.PaperJpaRepository;
import gomgook.paperdot.paper.repository.PapersimpleESRepository;
import gomgook.paperdot.paper.repository.RankRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class RankService {
    private final PaperJpaRepository paperJpaRepository;
    private final RankRepository rankRepository;
    private final PapersimpleESRepository papersimpleESRepository;


    @Transactional
    @Scheduled(cron = "0 0 0 * * ?")
    public void updatePopularPapers() {
        rankRepository.deleteAll();
        for (int category =1; category<=5; category++) {
            List<Paper> papers = paperJpaRepository.findTop5ByCategoryOrderByBookmarkCntDesc(category).orElseThrow(() -> new ExceptionResponse(CustomException.FAIL_GET_TOP5_PAPER_EXCEPTION));
            List<Rank> ranks = new ArrayList<>();
            int rank = 1;
            for (Paper paper : papers) {
                Rank paperRank = new Rank(paper.getId(), paper.getCategory(), rank);

                ranks.add(paperRank);
            }

            rankRepository.saveAll(ranks);
        }

    }

    public List<RankResponse> getPaperRank(int category) {

        List<Rank> ranks = rankRepository.findAllByCategory(category).orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND_RANK_EXCEPTION));

        List<Long> paperIds = ranks.stream()
                .map(Rank::getPaperId)
                .toList();

        List<PaperSimpleDocument> paperSimpleDocuments = papersimpleESRepository.findAllByIdIn(paperIds).orElseThrow(() -> new ExceptionResponse(CustomException.FAIL_GET_PAPER_ES_EXCEPTION));

        return setRankDTO(paperSimpleDocuments, ranks);
    }

    public List<RankResponse> setRankDTO(List<PaperSimpleDocument> paperSimpleDocuments, List<Rank> ranks) {
        List<RankResponse> rankResponses = new ArrayList<>();

        for (PaperSimpleDocument paperSimpleDocument : paperSimpleDocuments) {
            RankResponse rankResponse = new RankResponse();
            long paperId = paperSimpleDocument.getId();
            rankResponse.setPaperId(paperId);

            for(Rank rank: ranks) {
                if(rank.getPaperId() == paperId) rankResponse.setRank(rank.getRank());
            }

            String title = null;
            title = (paperSimpleDocument.getTitle().getKo() != null) ? paperSimpleDocument.getTitle().getKo() : paperSimpleDocument.getTitle().getEn();
            rankResponse.setTitle(title);

            rankResponses.add(rankResponse);

        }
        return rankResponses;
    }
}
