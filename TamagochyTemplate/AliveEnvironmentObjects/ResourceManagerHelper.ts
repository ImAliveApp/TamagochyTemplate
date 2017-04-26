class ResourceManagerHelper {
    private resourceManager: IResourceManager;

    protected imageResources: collections.Dictionary<string, Array<IAliveResource>>;
    protected soundResources: collections.Dictionary<string, Array<IAliveResource>>;
    protected imageList: Array<IAliveResource>;
    protected soundList: Array<IAliveResource>;

    constructor(resourceManager: IResourceManager) {
        this.resourceManager = resourceManager;

        this.setupResourceMap();
    }

    private setupResourceMap(): void {
        this.soundResources = new collections.Dictionary<string, Array<IAliveResource>>();
        this.imageResources = new collections.Dictionary<string, Array<IAliveResource>>();
        this.soundList = new Array<IAliveResource>();
        this.imageList = new Array<IAliveResource>();

        this.setupResourceLists();
        this.setupResourceMaps();
    }

    private setupResourceLists(): void {
        const allResources = this.resourceManager.getAllResources();
        for (let i = 0; i < allResources.length; i++) {
            if (allResources[i].getType() === 5) {// sound
                this.soundList.push(allResources[i]);
            } else {
                this.imageList.push(allResources[i]);
            }
        }
    }

    private setupResourceMaps(): void {
        const arraySoundResources = this.soundList;
        const arrayImageResources = this.imageList;

        for (let i = 0; i < this.soundList.length; i++) {
            this.addResourceToMap(arraySoundResources[i], this.soundResources);
        }

        for (let i = 0; i < this.imageList.length; i++) {
            this.addResourceToMap(arrayImageResources[i], this.imageResources);
        }
    }

    private addResourceToMap(res: IAliveResource, dict: collections.Dictionary<string, Array<IAliveResource>>): void {
        const categoryName = res.getCategoryName();
        if (dict.containsKey(categoryName)) {
            dict.getValue(categoryName).push(res);
        } else {
            const newSet = new Array<IAliveResource>();
            newSet.push(res);
            dict.setValue(categoryName, newSet);
        }
    }

    public chooseRandomImage(categoryName: string): string {
        let randomIndex = this.getRandomIndex(this.imageResources.getValue(categoryName));
        if (randomIndex < 0) return null;
        return this.imageResources.getValue(categoryName)[randomIndex].getResourceName();
    }

    public chooseRandomSound(categoryName: string): string {
        let randomIndex = this.getRandomIndex(this.soundResources.getValue(categoryName));
        if (randomIndex < 0) return null;
        return this.soundResources.getValue(categoryName)[randomIndex].getResourceName();
    }

    private getRandomIndex(list: Array<IAliveResource>): number {
        let index = -1;
        if (list == null)
            return index;

        index = Math.floor(Math.random() * list.length);
        return index;
    }
}