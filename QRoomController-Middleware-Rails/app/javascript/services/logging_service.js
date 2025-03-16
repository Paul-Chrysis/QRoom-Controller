// Logging service for AR interface
// This service sends interaction logs to the Spring Boot backend API

class LoggingService {
  /**
   * Log an interaction
   * @param {Object} logData - The interaction data to log
   * @param {string} logData.taskId - ID of the task being performed
   * @param {string} logData.interfaceType - Type of interface ('gesture' or 'ar')
   * @param {string} logData.interactionType - Type of interaction or gesture
   * @param {boolean} logData.success - Whether the interaction was successful
   * @param {string} logData.deviceId - ID of the device being interacted with
   * @param {string} logData.widgetLabel - Label of the widget being interacted with
   * @param {string} logData.targetValue - Target value of the interaction
   * @param {string} logData.actualValue - Actual value achieved
   * @param {number} logData.timeElapsed - Time elapsed in milliseconds
   * @param {string} logData.userId - ID of the user (optional)
   * @param {string} logData.additionalInfo - Any additional information (optional)
   * @returns {Promise} - Promise that resolves when the log is saved
   */
  static async logInteraction(logData, token) {
    try {
      // Set timestamp if not provided
      if (!logData.timestamp) {
        logData.timestamp = new Date().toISOString();
      }

      // Make API call to log the interaction
      const response = await fetch('http://localhost:8080/api/v1/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(logData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error logging interaction:', error);
      // Don't throw the error - logging failures shouldn't break the app
      return null;
    }
  }

  /**
   * Start timing an interaction
   * @returns {number} - Start time in milliseconds
   */
  static startTiming() {
    return performance.now();
  }

  /**
   * Calculate elapsed time since startTime
   * @param {number} startTime - Start time from startTiming()
   * @returns {number} - Elapsed time in milliseconds
   */
  static getElapsedTime(startTime) {
    return Math.round(performance.now() - startTime);
  }

  /**
   * Log an AR interaction
   * @param {Object} params - Parameters for the AR interaction
   * @param {string} params.taskId - ID of the task being performed
   * @param {string} params.interactionType - Type of AR interaction
   * @param {boolean} params.success - Whether the interaction was successful
   * @param {string} params.deviceId - ID of the device
   * @param {string} params.widgetLabel - Label of the widget
   * @param {string} params.targetValue - Target value
   * @param {string} params.actualValue - Actual value
   * @param {number} params.timeElapsed - Time elapsed in milliseconds
   * @param {string} params.userId - ID of the user (optional)
   * @param {string} params.additionalInfo - Any additional information (optional)
   * @param {string} token - Authentication token
   * @returns {Promise} - Promise that resolves when the log is saved
   */
  static async logARInteraction(params, token) {
    return this.logInteraction({
      ...params,
      interfaceType: 'ar'
    }, token);
  }
}

export default LoggingService;
