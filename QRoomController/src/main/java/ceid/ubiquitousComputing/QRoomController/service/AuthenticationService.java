package ceid.ubiquitousComputing.QRoomController.service;

import ceid.ubiquitousComputing.QRoomController.model.AuthenticationRequest;
import ceid.ubiquitousComputing.QRoomController.model.AuthenticationResponse;
import ceid.ubiquitousComputing.QRoomController.model.RegisterRequest;
import ceid.ubiquitousComputing.QRoomController.enums.Role;
import ceid.ubiquitousComputing.QRoomController.exception.UserNameAlreadyExist;
import ceid.ubiquitousComputing.QRoomController.model.User;
import ceid.ubiquitousComputing.QRoomController.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
        Optional<User> isAlreadyInUse=userRepository.findUserByUsername(request.getUsername());
        if (isAlreadyInUse.isEmpty()){
            userRepository.save(user);
            var jwtToken = jwtService.generateToken(user);
            return AuthenticationResponse.builder().token(jwtToken).build();
        }else {
            throw new UserNameAlreadyExist(isAlreadyInUse.get().getUsername());
        }

    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        System.out.println("im in");
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(),request.getPassword()));
        var user = userRepository.findUserByUsername(request.getUsername()).orElseThrow();
        System.out.println(user.getUsername());
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }
}
