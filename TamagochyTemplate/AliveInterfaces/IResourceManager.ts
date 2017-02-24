interface IResourceManager {
    getResourceByName(resourceName: string): IAliveResource;
    getAllResources(): IAliveResource[];
};
