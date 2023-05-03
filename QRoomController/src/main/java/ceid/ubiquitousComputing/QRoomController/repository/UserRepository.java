package ceid.ubiquitousComputing.QRoomController.repository;




import ceid.ubiquitousComputing.QRoomController.model.User;
import org.springframework.data.mongodb.repository.*;


public interface UserRepository extends MongoRepository<User, Integer> {

}