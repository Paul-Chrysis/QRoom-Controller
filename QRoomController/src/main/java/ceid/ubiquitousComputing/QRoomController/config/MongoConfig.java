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

            userRepository.deleteAll();
            deviceRepository.deleteAll();

            userRepository.save(new User(true, "UCL","Andreas", "Komninos"));
            userRepository.save(new User(false, "Chrysis@ceid","Paul", "Chrysis"));
            deviceRepository.save(new Device("projector",new State(true,false, new ArrayList<>(){{add(new Widget("Intensity",false,"bar",50));}})));
            deviceRepository.save(new Device("lights",new State(false,true, new ArrayList<>(){{add(new Widget("Intensity",false,"bar",75));}})));

        };
    }
}