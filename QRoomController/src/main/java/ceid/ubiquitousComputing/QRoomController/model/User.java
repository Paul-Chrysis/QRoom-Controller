package ceid.ubiquitousComputing.QRoomController.model;

import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "user")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    private ObjectId mongoId;
    private int id;
    private boolean isAdmin;
    private String username;
    private String firstName;
    private String lastName;


    public User(int id, boolean isAdmin, String username,String firstName, String lastName) {
        this.id = id;
        this.isAdmin = isAdmin;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
