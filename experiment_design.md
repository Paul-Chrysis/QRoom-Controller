# QRoom Controller Experiment Design

This document outlines the experiment design for comparing the two interfaces of the QRoom Controller system:
1. **Gesture-based interface** (React + MediaPipe)
2. **AR-based interface** (Rails + AR.js + A-Frame-GUI)

## User Tasks

The following tasks are designed to test both interfaces across a range of complexity levels and interaction types.

### Basic Tasks

1. **Device Discovery**
   - Description: Find and connect to a specific device in the room
   - Example: "Connect to the living room lamp"
   - Skills tested: Navigation, QR code scanning/AR marker recognition

2. **Simple Toggle**
   - Description: Turn a device on or off
   - Example: "Turn on the smart light"
   - Skills tested: Basic gesture/AR interaction

3. **Status Check**
   - Description: Check the current state of a device
   - Example: "Check if the heater is on"
   - Skills tested: UI comprehension, information retrieval

### Intermediate Tasks

4. **Value Adjustment**
   - Description: Change a device's value to a specific setting
   - Example: "Set the brightness to 75%"
   - Skills tested: Precision control, feedback understanding

5. **Multiple Device Interaction**
   - Description: Control two devices in sequence
   - Example: "Turn off the TV and then set the thermostat to 22°C"
   - Skills tested: Context switching, memory, navigation

6. **Range Control**
   - Description: Adjust a device with a range of values
   - Example: "Set the speaker volume to minimum, then to maximum, then to 50%"
   - Skills tested: Continuous control, understanding value limits

### Advanced Tasks

7. **Complex Sequence**
   - Description: Perform a series of 3+ actions in sequence
   - Example: "Turn on the light, set it to blue, then reduce brightness to 30%"
   - Skills tested: Multi-step operations, memory, efficiency

8. **Precision Control**
   - Description: Make precise adjustments
   - Example: "Increase the thermostat temperature by exactly 2 degrees"
   - Skills tested: Fine motor control, system feedback interpretation

9. **Recovery from Error**
   - Description: Intentionally create a situation where the user needs to correct a mistake
   - Example: "Set the wrong device, then find and set the correct one"
   - Skills tested: Error recognition, problem-solving, system navigation

## Data Collection Methods

### Quantitative Metrics

1. **Task Completion Time**
   - Measure how long it takes users to complete each task
   - Start timing from when the task is presented
   - End timing when the user indicates they've completed the task

2. **Error Rate**
   - Count the number of errors made during task completion
   - Types of errors to track:
     - Incorrect gestures/interactions
     - Wrong device selection
     - Wrong value settings
     - Navigation errors

3. **Gesture/Interaction Recognition Accuracy**
   - Percentage of gestures/interactions correctly recognized by the system
   - Calculate: (Correctly recognized interactions / Total attempted interactions) × 100%

4. **Learning Curve**
   - Measure improvement in task completion time across multiple attempts
   - Have users repeat similar tasks and track performance improvements

5. **Precision**
   - How close users get to the target values
   - Example: If asked to set brightness to 75%, record the actual value they set

### Qualitative Metrics

1. **System Usability Scale (SUS)**
   - Standardized 10-item questionnaire with 5-point Likert scale
   - Provides a score from 0-100 indicating overall usability

2. **NASA Task Load Index (NASA-TLX)**
   - Measures perceived workload across six dimensions:
     - Mental Demand
     - Physical Demand
     - Temporal Demand
     - Performance
     - Effort
     - Frustration

3. **User Preference**
   - Direct comparison questions asking which interface users preferred for specific tasks
   - Example: "Which interface did you find easier to use for turning devices on/off?"

4. **Comfort and Fatigue**
   - Ratings of physical comfort and fatigue after using each interface
   - Track changes in comfort over time (e.g., after 5 minutes, 10 minutes, etc.)

5. **Perceived Naturalness**
   - How natural/intuitive each interface feels
   - Questions about how quickly users felt comfortable with each interface

## Implementation for Data Collection

### Automated Logging

Add logging to both applications to record:

#### For Gesture-based Interface (React):

```javascript
// Example logging function
const logInteraction = async (taskId, gestureType, success, deviceId, widgetLabel, targetValue, actualValue) => {
  try {
    await axios.post('/api/log', {
      taskId,
      interface: 'gesture',
      timestamp: new Date().toISOString(),
      gestureType,
      success,
      deviceId,
      widgetLabel,
      targetValue,
      actualValue,
      timeElapsed: performance.now() - taskStartTime
    });
  } catch (err) {
    console.error('Failed to log interaction', err);
  }
};
```

#### For AR-based Interface (Rails):

```ruby
# Example logging controller action
def log_interaction
  InteractionLog.create(
    task_id: params[:task_id],
    interface: 'ar',
    timestamp: Time.now,
    interaction_type: params[:interaction_type],
    success: params[:success],
    device_id: params[:device_id],
    widget_label: params[:widget_label],
    target_value: params[:target_value],
    actual_value: params[:actual_value],
    time_elapsed: params[:time_elapsed]
  )
  
  head :ok
end
```

### Post-Task Questionnaires

Create a short questionnaire after each task asking about:
- Perceived difficulty (1-5 scale)
- Satisfaction with the interface for this task (1-5 scale)
- Any frustrations encountered

### Final Comparative Survey

After using both interfaces, have users complete a survey comparing them directly:
- Which interface was easier to learn?
- Which felt more natural?
- Which was more physically comfortable?
- Which would they prefer to use in their home?

## Experiment Protocol

1. **Participant Briefing**
   - Explain the purpose of the study
   - Provide basic training on both interfaces
   - Explain the tasks they'll be performing

2. **Counterbalancing**
   - Half the participants start with gesture interface, half with AR
   - This controls for learning effects

3. **Task Execution**
   - Present tasks in the same order for both interfaces
   - Allow a short break between tasks
   - Record metrics automatically where possible

4. **Post-Interface Questionnaire**
   - After completing all tasks with one interface, have users complete the SUS and NASA-TLX

5. **Final Comparative Questionnaire**
   - After using both interfaces, have users complete the comparative survey

6. **Debrief Interview**
   - Ask open-ended questions about their experience
   - Probe for specific insights about each interface

## Sample Questionnaires

### System Usability Scale (SUS)

1. I think that I would like to use this system frequently.
2. I found the system unnecessarily complex.
3. I thought the system was easy to use.
4. I think that I would need the support of a technical person to be able to use this system.
5. I found the various functions in this system were well integrated.
6. I thought there was too much inconsistency in this system.
7. I would imagine that most people would learn to use this system very quickly.
8. I found the system very cumbersome to use.
9. I felt very confident using the system.
10. I needed to learn a lot of things before I could get going with this system.

*Each item is rated on a scale from 1 (Strongly Disagree) to 5 (Strongly Agree)*

### NASA Task Load Index (NASA-TLX)

Rate each dimension on a scale from 0 (Very Low) to 100 (Very High):

1. **Mental Demand**: How mentally demanding was the task?
2. **Physical Demand**: How physically demanding was the task?
3. **Temporal Demand**: How hurried or rushed was the pace of the task?
4. **Performance**: How successful were you in accomplishing what you were asked to do?
5. **Effort**: How hard did you have to work to accomplish your level of performance?
6. **Frustration**: How insecure, discouraged, irritated, stressed, and annoyed were you?

### Comparative Questionnaire

1. Which interface was easier to learn?
   - [ ] Gesture-based interface
   - [ ] AR-based interface
   - [ ] Both equally easy/difficult

2. Which interface felt more natural to use?
   - [ ] Gesture-based interface
   - [ ] AR-based interface
   - [ ] Both equally natural/unnatural

3. Which interface was more physically comfortable to use?
   - [ ] Gesture-based interface
   - [ ] AR-based interface
   - [ ] Both equally comfortable/uncomfortable

4. Which interface would you prefer to use in your home?
   - [ ] Gesture-based interface
   - [ ] AR-based interface
   - [ ] No preference

5. For which types of tasks did you prefer the gesture-based interface?
   (Open text response)

6. For which types of tasks did you prefer the AR-based interface?
   (Open text response)

7. What improvements would you suggest for the gesture-based interface?
   (Open text response)

8. What improvements would you suggest for the AR-based interface?
   (Open text response)
