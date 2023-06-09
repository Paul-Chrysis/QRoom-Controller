package ceid.ubiquitousComputing.QRoomController.repository;

import ceid.ubiquitousComputing.QRoomController.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;


public interface UserRepository extends MongoRepository<User, Integer> {
    @Query("{ 'username' : ?0 }")
    Optional<User> findUserByUsername(String username);

    @Query("{ '_id' : ?0 }")
    Optional<User> findUserById(String id);

}