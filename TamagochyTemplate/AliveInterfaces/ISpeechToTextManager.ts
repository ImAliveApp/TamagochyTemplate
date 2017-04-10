interface ISpeechToTextManager {

    /**
     * This method will return true if the speech recognition service is available in the phone.
     */
    isSpeechRecognitionAvailable(): boolean;

    /**
     * This method will start the speech recognition procedure (it will start capturing what the user say).
     * The results will be sent to the onSpeechRecognitionResults method of the IAliveAgent interface.
     */
    startSpeechRecognition(): void;

    /**
     * This method will stop the speech recognition procedure.
     * The results will be sent to the onSpeechRecognitionResults method of the IAliveAgent interface.
     */
    stopSpeechRecognition(): void;

    /**
     * This method will set the speech recognition service to try and parse to that language.
     * @param language The language to parse.
     */
    setSpeechLanguage(language: string): void;
};