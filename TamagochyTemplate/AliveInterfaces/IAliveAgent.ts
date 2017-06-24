interface IAliveAgent {
    onTick(currentTime: number): void;
    onBackgroundTick(currentTime: number);
    onStart(handler: IManagersHandler, disabledPermissions: string[]): void;
    onPhoneEventOccurred(eventName: string, jsonedData: string): void;
    onRelease(currentX: number, currentY: number): void;
    onPick(currentX: number, currentY: number): void;
    onMenuItemSelected(viewName: string): void;
    onConfigureMenuItems(menuBuilder: IMenuBuilder): void;
    onResponseReceived(response: string): void;
    onLocationReceived(location: IAliveLocation): void;
    onUserActivityStateReceived(state: IAliveUserActivity): void;
    onHeadphoneStateReceived(state: number): void;
    onWeatherReceived(weather: IAliveWeather): void;
    onPlacesReceived(places: IAlivePlaceLikelihood[]): void;
    onSpeechRecognitionResults(results: string): void;
    onUserEventOccurred(eventName: string, jsonedData: string): void;
};