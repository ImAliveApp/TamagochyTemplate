interface IConfigurationManager {

   /**
    * This method will return the screen height.
    */
    getScreenHeight(): number;

   /**
    * This method will return the screen width.
    */
    getScreenWidth(): number;

   /**
    * This method will return the current screen orientation (1- Portrait, 2- Landscape, 3- Square)
    */
    getScreenOrientation(): number;

   /**
    * This method will return the current surface angle (a value between 0-360)
    * When the phone is static (not tilted to any side) this method will return 0.
    * When tiling the phone to the LEFT, the angle will be 360 minus how much the phone is tilted to the LEFT.
    * When tilting the phone to the RIGHT, the angle will be 0 plus how much the phone is tilted to the RIGHT.
    */
    getCurrentSurfaceAngle(): number;

   /**
    * This method will return true if the screen is currently off.
    */
    isScreenOff(): boolean;

   /**
    * This method will return true if there is a sound resource playing in the background.
    */
    isSoundPlaying(): boolean;

   /**
    * This method will return true if the phone is connected to the internet.
    */
    isInternetConnected(): boolean;

   /**
    * This method will return true if the phone is in Airplane mode.
    */
    isAirplaneModeOn(): boolean;

   /**
    * This method will return an object containing information about the current time on the phone.
    */
    getCurrentTime(): ICurrentTime;

   /**
    * This method will return the maximum value that can be used as a resize ratio for the actionManager.draw method.
    * The system will take this value if the script tries to resize to a value that is bigger than this.
    */
    getMaximalResizeRatio(): number;

   /**
    * This method will return the System language.
    */
    getSystemLanguage(): string;

   /**
    * This method will return the System language in an ISO3 format.
    */
    getSystemISO3Language(): string;

   /**
    * This method will return the system country.
    */
    getSystemCountry(): string;

   /**
    * This method will return the system country in an ISO3 format.
    */
    getSystemISO3Country(): string;
};
