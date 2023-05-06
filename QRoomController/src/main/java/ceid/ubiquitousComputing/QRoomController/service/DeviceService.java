package ceid.ubiquitousComputing.QRoomController.service;

import ceid.ubiquitousComputing.QRoomController.enums.Role;
import ceid.ubiquitousComputing.QRoomController.model.Device;
import ceid.ubiquitousComputing.QRoomController.model.State;
import ceid.ubiquitousComputing.QRoomController.model.User;
import ceid.ubiquitousComputing.QRoomController.model.Widget;
import ceid.ubiquitousComputing.QRoomController.repository.DeviceRepository;

import ceid.ubiquitousComputing.QRoomController.repository.UserRepository;
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
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public Optional<Device> findDeviceById(String id){
        return deviceRepository.findDeviceById(id);
    }

    public List<String> findDevicesIds() {
        return deviceRepository.findDevicesId();
    }
    public Boolean isAdmin(String token){
        String jwtToken = token.substring(7);
        String username = jwtService.extractUsername(jwtToken);
        Optional<User> user= userRepository.findUserByUsername(username);
        if (user.isPresent()){
            Role role = user.get().getRole();
            return (role.equals(Role.ADMIN));
        }
        return false;
    }
    public ResponseEntity<?> updateDeviceState(String token ,String id, Widget widget) {
        Boolean isAdmin = isAdmin(token);
        Optional<Device> deviceToUpdate =  findDeviceById(id);
        if(deviceToUpdate.isPresent()){
           Device device = deviceToUpdate.get();
           State currentState =  device.getState();
           if (currentState.isAdminOnly() && !isAdmin){
                throw new RuntimeException();
           }
            System.out.println(widget==null);
           if (widget == null){
               currentState.setDevice_isActive(!currentState.isDevice_isActive());

           }else{
           ArrayList<Widget> widgets = currentState.getDevice_widgets();
           for (int i=0; i<widgets.size(); i++){
               if (widgets.get(i).getWidget_label().equals(widget.getWidget_label())){
                   if (widgets.get(i).isWidget_isAdminOnly() && !isAdmin){
                       throw new RuntimeException();
                   }
                   widgets.get(i).setWidget_state(widget.getWidget_state());
                   currentState.setDevice_widgets(widgets);
               }
           }}
            device.setState(currentState);
            deviceRepository.save(device);
            return new ResponseEntity<>(device, HttpStatus.OK);
        }else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
