package gomgook.paperdot.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CustomException {

    //400
    NOT_EMPTY_ROLE_EXCEPTION(400,"NotEmptyRoleException","권한이 존재하지 않습니다."),
    ID_PASSWORD_INPUT_EXCEPTION(400,"IdPasswordInputException", "아이디 패스워드 입력이 잘못 되었습니다."),
    DUPLICATED_EMAIL_EXCEPTION(400,"DuplicatedEmailException","이미 가입된 이메일입니다."),
    DUPLICATED_FRIEND_REQUEST_EXCEPTION(400,"DuplicatedFriendRequestException","이미 보낸 친구 요청입니다."),
    NOT_FOUND_MEMBER_EXCEPTION(400,"NotFoundMemberException","유저가 존재하지 않습니다."),
    NOT_FOUND_SPECIES_EXCEPTION(400, "NotFoundSpeciesException", "해당 종이 존재하지 않습니다."),
    NOT_FOUND_FOREST_EXCEPTION(400, "NotFoundForestException", "숲이 존재하지 않습니다."),
    NOT_FOUND_ITEM_EXCEPTION(400, "NotFoundItemException", "아이템을 불러오지 못했습니다."),
    NOT_FOUND_FOREST_ITEM_EXCEPTION(400, "NotFoundForestItemException", "숲에 아이템이 없습니다."),
    NOT_FOUND_BACKGROUND_ITEM_EXCEPTION(400, "NotFoundBackgroundItemException", "테마를 불러오지 못했습니다."),
    NOT_FOUND_FRIEND_EXCEPTION(400, "NotFoundFriendException", "친구 아이디가 없습니다."),
    NOT_FOUND_MESSAGE_EXCEPTION(400, "NotFoundMessageException", "메세지가 없습니다."),
    NOT_FOUND_RESULT_EXCEPTION(400, "NotFoundResultException", "결과가 없습니다."),
    FAIL_SAVE_FRIEND_EXCEPTION(400, "FailSaveFriendException", "친구 저장에 실패했습니다."),
    FAIL_SAVE_FOREST_EXCEPTION(400, "FailSaveForestException", "숲 정보 저장에 실패했습니다."),
    FAIL_SAVE_MESSAGE_EXCEPTION(400, "FailSaveMessageException", "메세지 저장에 실패했습니다."),
    FAIL_DELETE_ITEM_EXCEPTION(400, "FailDeleteItemException", "아이템 삭제에 실패했습니다."),
    FAIL_SEND_NOTIFICATION_EXCEPTION(400, "FailSendNotificationException", "알림 전송에 실패했습니다."),

    //인증 에러 401
    EXPIRED_JWT_EXCEPTION(401,"ExpiredJwtException","토큰이 만료했습니다."),
    NOT_VALID_JWT_EXCEPTION(401,"NotValidJwtException","토큰이 유효하지 않습니다."),

    //403
    ACCESS_DENIED_EXCEPTION(403,"AccessDeniedException","권한이 없습니다");

    private int statusNum;
    private String errorCode;
    private String errorMessage;
}
