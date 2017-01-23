interface IVoice {
    getLatency(): number;
    getLanguage(): string;
    getQuality(): number;
    getName(): string;
    isNetworkConnectionRequired(): boolean;
    getFeatures(): string[];
}