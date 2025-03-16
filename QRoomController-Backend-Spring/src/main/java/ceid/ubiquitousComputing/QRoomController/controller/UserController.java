package ceid.ubiquitousComputing.QRoomController.controller;

import ceid.ubiquitousComputing.QRoomController.model.User;
import ceid.ubiquitousComputing.QRoomController.service.UserService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/user")
public class UserController {
    private final UserService userService;


    public UserController(UserService userService){this.userService=userService;}

    @GetMapping("/users")
    public List<User> list() {
        return userService.findAll();
    }


    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable("id") String id ){
        return userService.findUserById(id);
    }
}