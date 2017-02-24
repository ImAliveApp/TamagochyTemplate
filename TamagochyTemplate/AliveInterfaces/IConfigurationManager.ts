interface IConfigurationManager {
    getScreenHeight(): number;
    getScreenWidth(): number;
    getScreenOrientation(): number;
    getCurrentSurfaceAngle(): number;
    isScreenOff(): boolean;
    isSoundPlaying(): boolean;
    isInternetConnected(): boolean;
    isAirplaneModeOn(): boolean;
    getCurrentTime(): ICurrentTime;
    getMaximalResizeRatio(): number;
    getSystemLanguage(): string;
    getSystemISO3Language(): string;
    getSystemCountry(): string;
    getSystemISO3Country(): string;
};
