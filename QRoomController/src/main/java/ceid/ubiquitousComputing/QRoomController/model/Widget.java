package ceid.ubiquitousComputing.QRoomController.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class Widget {
    private String widget_label;
    private boolean widget_isAdminOnly;
    private String widget_type;
    private int widget_state;
}
