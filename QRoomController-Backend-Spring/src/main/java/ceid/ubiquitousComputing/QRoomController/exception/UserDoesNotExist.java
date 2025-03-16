package ceid.ubiquitousComputing.QRoomController.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class UserDoesNotExist extends RuntimeException {
    public UserDoesNotExist(String username){
        super(username+ " already exists");
    }
}
