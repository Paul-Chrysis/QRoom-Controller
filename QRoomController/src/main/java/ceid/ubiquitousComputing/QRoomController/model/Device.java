package ceid.ubiquitousComputing.QRoomController.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "device")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Device {
    @Id
    private ObjectId objectId;
    private int deviceId;
    private String deviceType;//probably its better to use ENUM
    private State state;
    public Device(int deviceId, String deviceType, State state) {
        this.deviceId = deviceId;
        this.deviceType = deviceType;
        this.state = state;
    }


}

