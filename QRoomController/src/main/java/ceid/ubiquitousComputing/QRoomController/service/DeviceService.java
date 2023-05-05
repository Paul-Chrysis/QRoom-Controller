package ceid.ubiquitousComputing.QRoomController.service;

import ceid.ubiquitousComputing.QRoomController.model.Device;
import ceid.ubiquitousComputing.QRoomController.model.State;
import ceid.ubiquitousComputing.QRoomController.model.Widget;
import ceid.ubiquitousComputing.QRoomController.repository.DeviceRepository;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class DeviceService {

    private final DeviceRepository deviceRepository;

    public Optional<Device> findDeviceById(String id){
        return deviceRepository.findDeviceById(id);
    }

    public List<String> findDevicesIds() {
        return deviceRepository.findDevicesId();
    }

    public ResponseEntity<?> updateDeviceState(String id, Widget widget) {
        Optional<Device> deviceToUpdate =  findDeviceById(id);
        System.out.println(widget.getWidget_label());
        if(deviceToUpdate.isPresent()){
           Device device = deviceToUpdate.get();
           State currentState =  device.getState();
           ArrayList<Widget> widgets = currentState.getDevice_widgets();
           for (int i=0; i<widgets.size(); i++){
               if (widgets.get(i).getWidget_label().equals(widget.getWidget_label())){
                   System.out.println(widget.getWidget_label());
                   widgets.get(i).setWidget_state(widget.getWidget_state());
                   currentState.setDevice_widgets(widgets);
                   device.setState(currentState);
               }
           }
            deviceRepository.save(device);
            return new ResponseEntity<>(device, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
