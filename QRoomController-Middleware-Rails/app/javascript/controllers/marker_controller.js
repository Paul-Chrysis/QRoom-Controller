import { Controller } from "@hotwired/stimulus";
import LoggingService from "../services/logging_service";

export default class extends Controller {
  static targets = ["marker", "container"];
  
  // Timing reference for logging
  interactionStartTime = null;

  connect() {
    console.log("Connected to MarkerController");

    // Initialize the cursor for interaction if it doesn't already exist
    const scene = AFRAME.scenes[0];
    if (!scene.querySelector('[cursor]')) {
      const mouseCursor = document.createElement('a-entity');
      mouseCursor.setAttribute('cursor', 'rayOrigin: mouse; fuse: false');
      mouseCursor.setAttribute('raycaster', 'objects: [gui-interactable]');
      scene.appendChild(mouseCursor);
    }

    this.markerTarget.addEventListener("markerFound", this.handleMarkerFound.bind(this));
  }

  handleMarkerFound(event) {
    // Start timing for marker detection
    this.interactionStartTime = LoggingService.startTiming();
    
    let markerId = this.markerTarget.getAttribute("value"); // Get detected marker ID
    console.log("Detected marker ID:", markerId);

    // Fetch device data from Rails API
    fetch(`/devices/${parseInt(markerId)-1}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': this.getMetaValue("csrf-token") // Include the authenticity token
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log("Device data:", data);
      this.device = data;
      this.updateMarkerLayout();
      
      // Log successful marker detection
      const timeElapsed = LoggingService.getElapsedTime(this.interactionStartTime);
      const token = document.querySelector('meta[name="csrf-token"]').content;
      
      LoggingService.logARInteraction({
        taskId: 'marker_detection',
        interactionType: 'marker_scan',
        success: true,
        deviceId: markerId,
        timeElapsed: timeElapsed,
        additionalInfo: `Device type: ${data.deviceType}`
      }, token);
    })
    .catch(error => {
      console.error("Error fetching device data:", error);
      
      // Log failed marker detection
      const timeElapsed = LoggingService.getElapsedTime(this.interactionStartTime);
      const token = document.querySelector('meta[name="csrf-token"]').content;
      
      LoggingService.logARInteraction({
        taskId: 'marker_detection',
        interactionType: 'marker_scan',
        success: false,
        deviceId: markerId,
        timeElapsed: timeElapsed,
        additionalInfo: `Error: ${error.message}`
      }, token);
    });
  }

  getMetaValue(name) {
    const element = document.head.querySelector(`meta[name="${name}"]`);
    return element && element.getAttribute("content");
  }

  updateMarkerLayout() {
    const container = this.containerTarget;
    container.innerHTML = ''; // Clear previous content

    // Add a label with the device type
    const deviceLabel = document.createElement('a-gui-label');
    deviceLabel.setAttribute('width', '2');
    deviceLabel.setAttribute('height', '0.4');
    deviceLabel.setAttribute('value', this.device.deviceType);
    deviceLabel.setAttribute('font-size', '0.4');
    deviceLabel.setAttribute('line-height', '0.4');
    deviceLabel.setAttribute('letter-spacing', '0');
    deviceLabel.setAttribute('margin', '0 0 0.5 0');
    container.appendChild(deviceLabel);

    // Add a toggle button for device_isActive
    const toggleButton = document.createElement('a-gui-button');
    toggleButton.setAttribute('width', '2');
    toggleButton.setAttribute('height', '0.25');
    toggleButton.setAttribute('value', 'Active');
    toggleButton.setAttribute('font-size', '0.15');
    toggleButton.setAttribute('margin', '0 0 0.05 0');
    toggleButton.setAttribute('toggle', 'true');
    toggleButton.setAttribute('toggle-state', this.device.state.device_isActive);
    toggleButton.addEventListener('click', () => {
      this.device.state.device_isActive = !this.device.state.device_isActive;
      this.sendDataToServer()
    });
    container.appendChild(toggleButton);

    // Add widgets
    this.device.state.device_widgets.forEach(widget => {
      // Create a label for the widget
      const widgetLabel = document.createElement('a-gui-label');
      widgetLabel.setAttribute('width', '2');
      widgetLabel.setAttribute('height', '0.25');
      widgetLabel.setAttribute('value', widget.widget_label);
      widgetLabel.setAttribute('font-size', '0.15');
      widgetLabel.setAttribute('line-height', '0.4');
      widgetLabel.setAttribute('letter-spacing', '0');
      widgetLabel.setAttribute('margin', '0 0 0.05 0');
      container.appendChild(widgetLabel);

      let widgetElement;
      switch (widget.widget_type) {
        case 'range':
          widgetElement = document.createElement('a-gui-slider');
          widgetElement.setAttribute('percent', (widget.widget_state - widget.widget_range.min) / (widget.widget_range.max - widget.widget_range.min));
          widgetElement.setAttribute('margin', '0 0 0.05 0'); // Ensure margin is set
          widgetElement.addEventListener('change', (event) => {
            // Start timing for interaction
            this.interactionStartTime = LoggingService.startTiming();
            
            let percent= widgetElement.getAttribute('gui-slider').percent ;
            const newValue = percent * (widget.widget_range.max - widget.widget_range.min) + widget.widget_range.min;
            const oldValue = widget.widget_state;
            widget.widget_state = newValue;
            let body =JSON.stringify({
              widget_label: widget.widget_label,
              widget_isAdminOnly: widget.widget_isAdminOnly,
              widget_type: widget.widget_type,
              widget_state: widget.widget_state,
            })
            
            // Log the interaction
            const timeElapsed = LoggingService.getElapsedTime(this.interactionStartTime);
            const token = document.querySelector('meta[name="csrf-token"]').content;
            
            LoggingService.logARInteraction({
              taskId: `widget_interaction_range`,
              interactionType: 'slider_change',
              success: true,
              deviceId: this.device.id,
              widgetLabel: widget.widget_label,
              targetValue: String(newValue),
              actualValue: String(oldValue),
              timeElapsed: timeElapsed
            }, token);
            
            this.sendDataToServer(body)
          });
          break;
        case 'bar':
          widgetElement = document.createElement('a-gui-slider');
          widgetElement.setAttribute('percent', widget.widget_state/100.0);
          widgetElement.setAttribute('margin', '0 0 0.05 0'); // Ensure margin is set
          widgetElement.addEventListener('click', (event) => {
            // Start timing for interaction
            this.interactionStartTime = LoggingService.startTiming();
            
            setTimeout(() => { 
              let newValue= event.target.components["gui-slider"].data.percent;
              console.log('newValue:', newValue*100);
              const oldValue = widget.widget_state;
              widget.widget_state = newValue*100;
              let body =JSON.stringify({
                widget_label: widget.widget_label,
                widget_isAdminOnly: widget.widget_isAdminOnly,
                widget_type: widget.widget_type,
                widget_state: widget.widget_state,
              })
              console.log('body:', body);
              
              // Log the interaction
              const timeElapsed = LoggingService.getElapsedTime(this.interactionStartTime);
              const token = document.querySelector('meta[name="csrf-token"]').content;
              
              LoggingService.logARInteraction({
                taskId: `widget_interaction_bar`,
                interactionType: 'slider_click',
                success: true,
                deviceId: this.device.id,
                widgetLabel: widget.widget_label,
                targetValue: String(newValue*100),
                actualValue: String(oldValue),
                timeElapsed: timeElapsed
              }, token);
              
              this.sendDataToServer(body)
            }, 100);
          });
          break;
        case 'on/off':
          widgetElement = document.createElement('a-gui-button');
          widgetElement.setAttribute('value', widget.widget_state ? 'On' : 'Off');
          widgetElement.setAttribute('font-size', '0.15');
          widgetElement.setAttribute('margin', '0 0 0.05 0');
          widgetElement.setAttribute('toggle', 'true');
          widgetElement.setAttribute('toggle-state', widget.widget_state);
          widgetElement.addEventListener('click', () => {
            // Start timing for interaction
            this.interactionStartTime = LoggingService.startTiming();
            
            const oldValue = widget.widget_state;
            const newValue = !oldValue;
            
            let body =JSON.stringify({
              widget_label: widget.widget_label,
              widget_isAdminOnly: widget.widget_isAdminOnly,
              widget_type: widget.widget_type,
              widget_state: newValue,
            })
            
            // Log the interaction
            const timeElapsed = LoggingService.getElapsedTime(this.interactionStartTime);
            const token = document.querySelector('meta[name="csrf-token"]').content;
            
            LoggingService.logARInteraction({
              taskId: `widget_interaction_onoff`,
              interactionType: 'toggle_click',
              success: true,
              deviceId: this.device.id,
              widgetLabel: widget.widget_label,
              targetValue: String(newValue),
              actualValue: String(oldValue),
              timeElapsed: timeElapsed
            }, token);
            
            this.sendDataToServer(body)
          });
          container.appendChild(toggleButton);
          break;
        default:
          widgetElement = document.createElement('a-gui-label');
          widgetElement.setAttribute('value', widget.widget_label);
          widgetElement.setAttribute('margin', '0 0 0.05 0'); // Ensure margin is set
      }
      widgetElement.setAttribute('width', '2');
      widgetElement.setAttribute('height', '0.25');
      widgetElement.setAttribute('font-size', '0.15');
      container.appendChild(widgetElement);
    });
  }

  sendDataToServer(body= null) {
    const updateStartTime = LoggingService.startTiming();
    const token = document.querySelector('[name="csrf-token"]').content;
    
    fetch('/devices/update_state', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': token
      },
      body: body
    })
    .then(response => response.json())
    .then(data => {
      // Update device state with response
      this.device.state = data.device.state;
      console.log('Device state:',this.device.state);
      
      // Log successful state update
      const timeElapsed = LoggingService.getElapsedTime(updateStartTime);
      
      LoggingService.logARInteraction({
        taskId: 'device_state_update',
        interactionType: 'state_update',
        success: true,
        deviceId: this.device.id,
        timeElapsed: timeElapsed,
        additionalInfo: `Updated state: ${JSON.stringify(data.device.state)}`
      }, token);
      
      // Optional: Show success message
      console.log('Device state updated successfully');
    })
    .catch(error => {
      // Log error
      const timeElapsed = LoggingService.getElapsedTime(updateStartTime);
      
      LoggingService.logARInteraction({
        taskId: 'device_state_update',
        interactionType: 'state_update',
        success: false,
        deviceId: this.device.id,
        timeElapsed: timeElapsed,
        additionalInfo: `Error: ${error.message}`
      }, token);
      
      // Revert toggle state on error
      console.error('Error updating device state:', error);
    });
  }
}
