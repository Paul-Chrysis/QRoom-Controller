package ceid.ubiquitousComputing.QRoomController.controller;


import ceid.ubiquitousComputing.QRoomController.model.Device;
import ceid.ubiquitousComputing.QRoomController.repository.DeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class DeviceController {
    @Autowired
    DeviceRepository deviceRepository;

    @GetMapping("/devices")
    public List<Device> list() {
        return deviceRepository.findAll();
    }

//    GET(USERID,DEVICEID) DEVICE STATE(DEVICETYPE, ADMINONLY, DEVICESTATE{DEVICEISACTIVE,[{WIDGETLABEL,WIDGETISADMINONLY,WIDGETTYPE,WIDGETSTATE},{WIDGETLABEL,WIDGETISADMINONLY,WIDGETTYPE,WIDGETSTATE}]})
//


}