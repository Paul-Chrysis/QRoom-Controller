package ceid.ubiquitousComputing.QRoomController.repository;

import ceid.ubiquitousComputing.QRoomController.model.InteractionLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InteractionLogRepository extends MongoRepository<InteractionLog, String> {
    
    List<InteractionLog> findByTaskId(String taskId);
    
    List<InteractionLog> findByInterfaceType(String interfaceType);
    
    List<InteractionLog> findBySuccess(boolean success);
    
    List<InteractionLog> findByDeviceId(String deviceId);
    
    List<InteractionLog> findByTimestampBetween(LocalDateTime start, LocalDateTime end);
    
    List<InteractionLog> findByInteractionType(String interactionType);
    
    List<InteractionLog> findByUserId(String userId);
}
