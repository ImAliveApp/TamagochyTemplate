interface IVoice {
    getLatency(): number;
    getLanguage(): string;
    getISO3Language(): string;
    getCountry(): string;
    getISO3Country(): string;
    getQuality(): number;
    getName(): string;
    isNetworkConnectionRequired(): boolean;
    getFeatures(): string[];
}