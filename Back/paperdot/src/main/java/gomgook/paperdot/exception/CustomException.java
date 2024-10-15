package gomgook.paperdot.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CustomException {

    //400
    NOT_EMPTY_ROLE_EXCEPTION(400,"NotEmptyRoleException","권한이 존재하지 않습니다."),
    ID_PASSWORD_INPUT_EXCEPTION(400,"IdPasswordInputException", "아이디 패스워드 입력이 잘못 되었습니다."),
    DUPLICATED_ID_EXCEPTION(400,"DuplicatedIdException","이미 가입된 아이디입니다."),
    DUPLICATED_NICKNAME_EXCEPTION(400,"DuplicatedNicknameException","이미 가입된 닉네임입니다."),
    NOT_FOUND_MEMBER_EXCEPTION(400,"NotFoundMemberException","유저가 존재하지 않습니다."),
    NOT_FOUND_PAPER_EXCEPTION(400, "NotFoundPaperException", "논문이 존재하지 않습니다."),
    NOT_FOUND_RESULT_EXCEPTION(400, "NotFoundResultException", "결과가 없습니다."),
    NOT_FOUND_RANK_EXCEPTION(400, "NotFoundRankException", "논문 랭킹 결과가 없습니다."),
    FAIL_SEND_NOTIFICATION_EXCEPTION(400, "FailSendNotificationException", "알림 전송에 실패했습니다."),
    FAIL_GET_TOP5_PAPER_EXCEPTION(400, "FailGetTop5PaperException", "북마크에 따른 논문을 가져올 수 없습니다."),
    FAIL_GET_PAPER_ES_EXCEPTION(400, "FailGetPaperESException", "논문 정보를 가져올 수 없습니다."),
    FAIL_CONVERT_MESSAGE_DTO_EXCEPTION(400, "FailConvertMessageDtoException", "메세지를 DTO형태로 바꿀 수 없습니다."),

    //인증 에러 401
    EXPIRED_JWT_EXCEPTION(401,"ExpiredJwtException","토큰이 만료했습니다."),
    NOT_VALID_JWT_EXCEPTION(401,"NotValidJwtException","토큰이 유효하지 않습니다."),

    //403
    ACCESS_DENIED_EXCEPTION(403,"AccessDeniedException","권한이 없습니다");

    private int statusNum;
    private String errorCode;
    private String errorMessage;
}
