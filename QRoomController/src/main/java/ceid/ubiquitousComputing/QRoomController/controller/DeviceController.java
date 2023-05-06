package ceid.ubiquitousComputing.QRoomController.controller;

import ceid.ubiquitousComputing.QRoomController.model.Device;
import ceid.ubiquitousComputing.QRoomController.model.Widget;
import ceid.ubiquitousComputing.QRoomController.service.DeviceService;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RequestMapping("api/v1/device")
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
    public ResponseEntity<?> setWidgetState(@RequestHeader("Authorization") String token,@PathVariable("id") String id,@Nullable @RequestBody Widget widget){
        return deviceService.updateDeviceState(token ,id, widget);
    }
}