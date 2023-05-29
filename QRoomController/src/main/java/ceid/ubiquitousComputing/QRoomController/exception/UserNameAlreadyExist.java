package ceid.ubiquitousComputing.QRoomController.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class UserNameAlreadyExist extends RuntimeException {
    public UserNameAlreadyExist(String username){
        super(username+ " already exists");
    }
}
