package ceid.ubiquitousComputing.QRoomController.repository;

import ceid.ubiquitousComputing.QRoomController.model.Device;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DeviceRepository extends MongoRepository<Device,Integer> {
}
