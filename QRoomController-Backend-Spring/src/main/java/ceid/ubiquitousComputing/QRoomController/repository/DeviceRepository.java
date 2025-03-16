package ceid.ubiquitousComputing.QRoomController.repository;

import ceid.ubiquitousComputing.QRoomController.model.Device;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface DeviceRepository extends MongoRepository<Device,Integer> {
    @Query(value = "{}", fields = "{ '_id' : 1 }")
    List<String> findDevicesId();

    @Query("{ '_id' : ?0 }")
    Optional<Device> findDeviceById(String id);

}
