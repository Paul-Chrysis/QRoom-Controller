package ceid.ubiquitousComputing.QRoomController.config;

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

import java.util.ArrayList;

@EnableMongoRepositories( basePackageClasses = {UserRepository.class, DeviceRepository.class})
@Configuration
public class MongoConfig {
    @Bean
    CommandLineRunner commandLineRunner(UserRepository userRepository, DeviceRepository deviceRepository) {
        return strings -> {
            userRepository.save(new User(1051000, true, "UCL","Andreas", "Komninos"));
            userRepository.save(new User(1051330, false, "Chrysis@ceid","Paul", "Chrysis"));
            deviceRepository.save(new Device(45,"projector",new State(true,false, new ArrayList<>(){{add(new Widget("Intensity",false,"bar",50));}})));
        };
    }
}