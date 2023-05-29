package ceid.ubiquitousComputing.QRoomController.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
@AllArgsConstructor
@Getter
@Setter
public class State {
    private boolean isAdminOnly;
    private boolean device_isActive;
    private ArrayList<Widget> device_widgets;
}
