interface IRestManager {
    postObject(path: string, json: string): void;
    getObject(path: string): void;
}