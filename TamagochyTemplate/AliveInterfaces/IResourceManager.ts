interface IResourceManager {

    /**
     * This method will return a reference to a resource with that name.
     * @param resourceName 
     */
    getResourceByName(resourceName: string): IAliveResource;

    /**
     * This method will return an array of all of the resource categories.
     */
    getAllResourceCategories(): string[];

    /**
     * This method will return an array containing all of the resources of the character.
     */
    getAllResources(): IAliveResource[];
};
