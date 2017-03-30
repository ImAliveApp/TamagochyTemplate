interface IRestManager {
    verifyUserIdentity(): void;
    postObject(path: string, json: string): void;
    getObject(path: string): void;
}