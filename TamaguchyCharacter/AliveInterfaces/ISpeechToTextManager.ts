interface ISpeechToTextManager {
    isSpeechRecognitionAvailable(): boolean;
    startSpeechRecognition(): void;
    stopSpeechRecognition(): void;
    setSpeechLanguage(language: string): void;
};