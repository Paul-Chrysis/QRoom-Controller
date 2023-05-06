package ceid.ubiquitousComputing.QRoomController.exception;

public class UserNameAlreadyExist extends RuntimeException {
    public UserNameAlreadyExist(String username){
        super(username+ " already exists");
    }
}
