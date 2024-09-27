package gomgook.paperdot.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ExceptionResponse extends RuntimeException{
    private CustomException customException;
}
