interface IAwarenessManager {

   /**
    * This method will start a process that checks if the headset is connected to the device.
    * The results will be sent to the onHeadphoneStateReceived method of the IAliveAgent interface.
    */
    getHeadsetState(): void;

   /**
    * This method will start a process that checks the location of the device.
    * The results will be sent to the onLocationReceived method of the IAliveAgent interface.
    */
    getLocation(): void;

   /**
    * This method will start a process that checks what places are around the device (shops, malls etc..)
    * The results will be sent to the onPlacesReceived method of the IAliveAgent interface.
    */
    getPlaces(): void;

   /**
    * This method will start a process that checks the current activity of the user (IN_VEHICLE, ON_BICYCLE, ON_FOOT, STILL, TILTING, WALKING, RUNNING, UNKNOWN)
    * The results will be sent to the onUserActivityStateReceived method of the IAliveAgent interface.
    */
    getUserActivity(): void;

   /**
    * This method will start a process that checks the weather at the location of the user.
    * The results will be sent to the onWeatherReceived method of the IAliveAgent interface.
    */
    getWeather(): void;
};