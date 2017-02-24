interface IDatabaseManager {
    saveObject(key: string, value: string): boolean;
    isObjectExist(key: string): boolean;
    getObject(key: string): string;
};
