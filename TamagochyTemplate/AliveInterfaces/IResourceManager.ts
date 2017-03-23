interface IResourceManager {
    getResourceByName(resourceName: string): IAliveResource;
    getAllResourceCategories(): string[];
    getAllResources(): IAliveResource[];
};
