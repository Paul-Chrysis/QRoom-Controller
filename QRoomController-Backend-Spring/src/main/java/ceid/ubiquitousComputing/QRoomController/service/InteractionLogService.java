package ceid.ubiquitousComputing.QRoomController.service;

import ceid.ubiquitousComputing.QRoomController.model.InteractionLog;
import ceid.ubiquitousComputing.QRoomController.repository.InteractionLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InteractionLogService {

    private final InteractionLogRepository interactionLogRepository;

    public InteractionLog saveLog(InteractionLog log) {
        if (log.getTimestamp() == null) {
            log.setTimestamp(LocalDateTime.now());
        }
        return interactionLogRepository.save(log);
    }

    public List<InteractionLog> getAllLogs() {
        return interactionLogRepository.findAll();
    }

    public Optional<InteractionLog> getLogById(String id) {
        return interactionLogRepository.findById(id);
    }

    public List<InteractionLog> getLogsByTaskId(String taskId) {
        return interactionLogRepository.findByTaskId(taskId);
    }

    public List<InteractionLog> getLogsByInterfaceType(String interfaceType) {
        return interactionLogRepository.findByInterfaceType(interfaceType);
    }

    public List<InteractionLog> getLogsBySuccess(boolean success) {
        return interactionLogRepository.findBySuccess(success);
    }

    public List<InteractionLog> getLogsByDeviceId(String deviceId) {
        return interactionLogRepository.findByDeviceId(deviceId);
    }

    public List<InteractionLog> getLogsByDateRange(LocalDateTime start, LocalDateTime end) {
        return interactionLogRepository.findByTimestampBetween(start, end);
    }

    public List<InteractionLog> getLogsByInteractionType(String interactionType) {
        return interactionLogRepository.findByInteractionType(interactionType);
    }

    public List<InteractionLog> getLogsByUserId(String userId) {
        return interactionLogRepository.findByUserId(userId);
    }

    // Analytics methods
    
    public long countSuccessfulInteractions() {
        return interactionLogRepository.findBySuccess(true).size();
    }
    
    public long countFailedInteractions() {
        return interactionLogRepository.findBySuccess(false).size();
    }
    
    public double calculateSuccessRate() {
        long successful = countSuccessfulInteractions();
        long total = successful + countFailedInteractions();
        return total > 0 ? (double) successful / total : 0;
    }
    
    public double calculateAverageTimeElapsed() {
        List<InteractionLog> logs = interactionLogRepository.findAll();
        if (logs.isEmpty()) {
            return 0;
        }
        
        long sum = logs.stream()
                .filter(log -> log.getTimeElapsed() != null)
                .mapToLong(InteractionLog::getTimeElapsed)
                .sum();
                
        long count = logs.stream()
                .filter(log -> log.getTimeElapsed() != null)
                .count();
                
        return count > 0 ? (double) sum / count : 0;
    }
}
