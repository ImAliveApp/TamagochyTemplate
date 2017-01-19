interface IVoice {
    getLatency(): number;
    getLanguage(): number;
    getQuality(): number;
    getName(): number;
    isNetworkConnectionRequired(): boolean;
    getFeatures(): String[];
}