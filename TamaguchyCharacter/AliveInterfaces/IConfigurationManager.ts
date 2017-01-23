interface IConfigurationManager {
    getScreenHeight(): number;
    getScreenWidth(): number;
    getScreenOrientation(): number;
    getCurrentSurfaceAngle(): number;
    getIsScreenOff(): boolean;
    getIsSoundPlaying(): boolean;
    getIsInternetConnected(): boolean;
    getIsAirplaneModeOn(): boolean;
    getCurrentTime(): ICurrentTime;
    getMaximalResizeRatio(): number;
    getSystemLanguage(): string;
    getSystemISO3Language(): string;
    getSystemCountry(): string;
    getSystemISO3Country(): string;
};
