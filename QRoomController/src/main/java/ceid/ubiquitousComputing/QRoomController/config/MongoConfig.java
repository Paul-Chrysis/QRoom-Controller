package ceid.ubiquitousComputing.QRoomController.config;

import ceid.ubiquitousComputing.QRoomController.enums.Role;
import ceid.ubiquitousComputing.QRoomController.model.Device;
import ceid.ubiquitousComputing.QRoomController.model.State;
import ceid.ubiquitousComputing.QRoomController.model.User;
import ceid.ubiquitousComputing.QRoomController.model.Widget;
import ceid.ubiquitousComputing.QRoomController.repository.DeviceRepository;
import ceid.ubiquitousComputing.QRoomController.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;

@EnableMongoRepositories( basePackageClasses = {UserRepository.class, DeviceRepository.class})
@Configuration
public class MongoConfig {
    private final PasswordEncoder passwordEncoder;

    public MongoConfig(PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    CommandLineRunner commandLineRunner(UserRepository userRepository, DeviceRepository deviceRepository) {
        return strings -> {

//            userRepository.deleteAll();
            deviceRepository.deleteAll();
            if(userRepository.findUserByUsername("admin").isEmpty()){
            var user = User.builder()
                    .username("admin")
                    .email("admin@qroomcontroller.gr")
                    .firstname("Paul")
                    .lastname("Chrysis")
                    .password(passwordEncoder.encode("adminpass"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(user);
            }

//            userRepository.save(new User( "UCL","Andreas", "Komninos","password","Komninos@ceid.upatras.gr"));
//            userRepository.save(new User( "Chrysis@ceid","Paul", "Chrysis","password", "chrysis@ceid.upatras.gr"));
            deviceRepository.save(new Device("projector",new State(true,false, new ArrayList<>(){{add(new Widget("Intensity",false,"bar",50));}})));
            deviceRepository.save(new Device("lights",new State(false,true, new ArrayList<>(){{add(new Widget("Intensity",false,"bar",75));}})));

        };
    }
}