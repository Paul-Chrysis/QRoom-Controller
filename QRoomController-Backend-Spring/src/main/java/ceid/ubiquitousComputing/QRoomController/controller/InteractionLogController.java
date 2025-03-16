package ceid.ubiquitousComputing.QRoomController.controller;

import ceid.ubiquitousComputing.QRoomController.model.InteractionLog;
import ceid.ubiquitousComputing.QRoomController.service.InteractionLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/logs")
@RequiredArgsConstructor
public class InteractionLogController {

    private final InteractionLogService interactionLogService;

    @PostMapping
    public ResponseEntity<InteractionLog> createLog(@RequestBody InteractionLog log) {
        InteractionLog savedLog = interactionLogService.saveLog(log);
        return ResponseEntity.ok(savedLog);
    }

    @GetMapping
    public ResponseEntity<List<InteractionLog>> getAllLogs() {
        List<InteractionLog> logs = interactionLogService.getAllLogs();
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InteractionLog> getLogById(@PathVariable String id) {
        Optional<InteractionLog> log = interactionLogService.getLogById(id);
        return log.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<InteractionLog>> getLogsByTaskId(@PathVariable String taskId) {
        List<InteractionLog> logs = interactionLogService.getLogsByTaskId(taskId);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/interface/{interfaceType}")
    public ResponseEntity<List<InteractionLog>> getLogsByInterfaceType(@PathVariable String interfaceType) {
        List<InteractionLog> logs = interactionLogService.getLogsByInterfaceType(interfaceType);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/success/{success}")
    public ResponseEntity<List<InteractionLog>> getLogsBySuccess(@PathVariable boolean success) {
        List<InteractionLog> logs = interactionLogService.getLogsBySuccess(success);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/device/{deviceId}")
    public ResponseEntity<List<InteractionLog>> getLogsByDeviceId(@PathVariable String deviceId) {
        List<InteractionLog> logs = interactionLogService.getLogsByDeviceId(deviceId);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<InteractionLog>> getLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<InteractionLog> logs = interactionLogService.getLogsByDateRange(start, end);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/interaction/{interactionType}")
    public ResponseEntity<List<InteractionLog>> getLogsByInteractionType(@PathVariable String interactionType) {
        List<InteractionLog> logs = interactionLogService.getLogsByInteractionType(interactionType);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<InteractionLog>> getLogsByUserId(@PathVariable String userId) {
        List<InteractionLog> logs = interactionLogService.getLogsByUserId(userId);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        analytics.put("successfulInteractions", interactionLogService.countSuccessfulInteractions());
        analytics.put("failedInteractions", interactionLogService.countFailedInteractions());
        analytics.put("successRate", interactionLogService.calculateSuccessRate());
        analytics.put("averageTimeElapsed", interactionLogService.calculateAverageTimeElapsed());
        
        return ResponseEntity.ok(analytics);
    }
}
