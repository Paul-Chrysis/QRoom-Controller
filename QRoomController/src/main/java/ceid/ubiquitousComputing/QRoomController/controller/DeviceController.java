package ceid.ubiquitousComputing.QRoomController.controller;

import ceid.ubiquitousComputing.QRoomController.model.Device;
import ceid.ubiquitousComputing.QRoomController.model.Widget;
import ceid.ubiquitousComputing.QRoomController.service.DeviceService;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Optional;

@RequestMapping("API/v1/device")
@RestController
@AllArgsConstructor
public class DeviceController {

    private final DeviceService deviceService;

    @GetMapping("/devices")
    public List<String> getDevicesIds(){
        return deviceService.findDevicesIds();
    }

    @GetMapping("{id}")
    public Optional<Device> getDeviceById(@PathVariable("id") String id){
        return deviceService.findDeviceById(id);
    }

    @PutMapping("{id}")
    public ResponseEntity<?> setWidgetState(@PathVariable("id") String id, @RequestBody Widget widget){
         return deviceService.updateDeviceState(id, widget);
    }

}