interface ITextToSpeechManager {

    /**
     * This method will set the text to speech service language to that language.
     * Once the language is set, the system will do its best to set a voice of that language aswell, so there is no need to set the voice yourself.
     * @param language The language to set.
     */
    setLanguage(language: string): void;

    /**
     * This method will make the text to speech service to say that text.
     * @param textToSay The text to say.
     */
    say(textToSay: string): void;

    /**
     * This method will set the pitch of the text to speech service.
     * 1.0 is the normal pitch, lower values lower the tone of the synthesized voice, greater values increase it.
     * @param pitch The pitch to set.
     */
    setPitch(pitch: number): void;

    /**
     * This method will set the speech rate of the text to speech service.
     * 1.0 is the normal speech rate, lower values slow down the speech (0.5 is half the normal speech rate), greater values accelerate it (2.0 is twice the normal speech rate).
     * @param speechRate The speech rate to set.
     */
    setSpeechRate(speechRate: number): void;

    /**
     * This method will set the voice of the text to speech service to the voice in that index in the voices array.
     * @param index The index of the voice to set.
     */
    setVoice(index: number): void;

    /**
     * This method will stop the current session of the text to speech service.
     */
    stopSpeaking(): void;

    /**
     * This method will return the maximum speech input length of the text to speech service on the device.
     */
    getMaxSpeechInputLength(): number;

    /**
     * This method will return an array containing the available voices on the device.
     * @param language The language to parse.
     */
    getVoices(): IVoice[];

    /**
     * This method will return the current active voice.
     */
    getCurrentVoice(): IVoice;

    /**
     * This method will return true if the text to speech service is currently saying something.
     */
    isSpeaking(): boolean;

    /**
     * This method will return true if the text to speech service is available on the device.
     */
    isAvailable(): boolean;
};