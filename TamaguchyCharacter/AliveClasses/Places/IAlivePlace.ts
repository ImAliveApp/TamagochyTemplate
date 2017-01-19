interface IAlivePlace {
    id: string;
    placeTypes: string;//list of types seperated by commas ( ',' ).
    address: string;
    name: string;
    latLng: IAliveLatLng;
    websiteUri: string;
    phoneNumber: string;
    rating: number;
    priceLevel: number;
    attributions: string;
    viewPort: IAliveLatLngBounds;
}