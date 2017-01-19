interface IAliveLocation {
    getLatitude(): number;
    getLongitude(): number;
    getBearing(): number;
    getAccuracy(): number;
    getSpeed(): number;
}