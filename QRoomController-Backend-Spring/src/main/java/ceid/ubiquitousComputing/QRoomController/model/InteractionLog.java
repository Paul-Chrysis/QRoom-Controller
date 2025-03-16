package ceid.ubiquitousComputing.QRoomController.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "interaction_logs")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InteractionLog {

    @Id
    private String id;
    private String taskId;
    private String interfaceType; // "gesture" or "ar"
    private LocalDateTime timestamp;
    private String interactionType; // gesture type or AR interaction
    private boolean success;
    private String deviceId;
    private String widgetLabel;
    private String targetValue;
    private String actualValue;
    private Long timeElapsed; // in milliseconds
    private String userId; // optional, to track which user performed the interaction
    private String additionalInfo; // for any extra information
}
