package ceid.ubiquitousComputing.QRoomController.controller;


import ceid.ubiquitousComputing.QRoomController.model.User;
import ceid.ubiquitousComputing.QRoomController.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class UserController {
    @Autowired
    UserRepository userRepository;

    @GetMapping("/users")
    public List<User> list() {
        return userRepository.findAll();
    }
}