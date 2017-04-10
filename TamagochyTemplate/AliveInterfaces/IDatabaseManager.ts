interface IDatabaseManager {

    /**
     * This method will save a value to the local database.
     * If you wish to save an object, please use JSON.stringify on that object, you can later retrieve is by using JSON.parse.
     * @param key The key associated with this value.
     * @param value The value to save.
     */
    saveObject(key: string, value: string): boolean;

    /**
     * This method will return true if an object associated with that key exists in the local database.
     * @param key The key to search.
     */
    isObjectExist(key: string): boolean;

    /**
     * This method will return an object that is associated with that key.
     * @param key The key to search.
     */
    getObject(key: string): string;
};
