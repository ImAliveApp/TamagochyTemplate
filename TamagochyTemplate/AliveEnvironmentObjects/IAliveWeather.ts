interface IAliveWeather {
    getWeatherDescription(): string;
    getDewPoint(): number;
    getFeelsLikeTemperature(): number;
    getTemperature(): number;
    getHumidity(): number;
}