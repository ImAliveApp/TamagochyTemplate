/// <reference path="Scripts/collections.ts" />

class AliveClass implements IAliveAgent {
    // ReSharper disable once InconsistentNaming
    private static UNREGISTERED_CATEGORY_RESOURCE = -999;

    private actionManager: IActionManager;
    private resourceManager: IResourceManager;
    private databaseManager: IDatabaseManager;
    private characterManager: ICharacterManager;
    private menuManager: IMenuManager;
    private configurationMananger: IConfigurationManager;
    private restManager: IRestManager;
    private managersHandler: IManagersHandler;
    private awarenessManager: IAwarenessManager;

    private resourceManagerHelper: ResourceManagerHelper;

    private currentRandomDrawingCategory: string;
    private lastVisabilityChangeTime: number;
    private visible: boolean;
    private deadPainted: boolean;
    private lastTime: number;
    private lastFallLeftTime: number;
    private lastFallRightTime: number;
    private currentTime: number;
    private lastPlaySoundTime: number;
    private lastDrawTime: number;
    private resizeRatio: number;

    private Hp: number;
    private lastEatingTime: number;
    private lastHungerTime: number;

    public constructor() {
        this.lastTime = 0;
        this.currentTime = 0;
        this.lastDrawTime = 0;
        this.lastPlaySoundTime = 0;
    }

    onStart(mHandler: IManagersHandler, disabledPermissions: string[]): void {
        this.actionManager = mHandler.getActionManager();
        this.resourceManager = mHandler.getResourceManager();
        this.databaseManager = mHandler.getDatabaseManager();
        this.characterManager = mHandler.getCharacterManager();
        this.menuManager = mHandler.getMenuManager();
        this.configurationMananger = mHandler.getConfigurationManager();
        this.restManager = mHandler.getRestManager();
        this.awarenessManager = mHandler.getAwarenessManager();
        this.resourceManagerHelper = new ResourceManagerHelper(this.resourceManager);
        this.actionManager.move(0, this.configurationMananger.getScreenHeight(), 0);
        this.resizeRatio = this.configurationMananger.getMaximalResizeRatio();
        this.drawAndPlayRandomResourceByCategory(AgentConstants.CHARACTER_ACTIVATION);
        this.lastHungerTime = this.configurationMananger.getCurrentTime().currentTimeMillis;
        this.lastEatingTime = 0;

        if (this.databaseManager.isObjectExist("health")) {
            this.Hp = parseInt(this.databaseManager.getObject("health"));
            this.menuManager.setProperty("healthProgress", "progress", this.Hp.toString());
        }
        else {
            this.Hp = 100;
            this.databaseManager.saveObject("health", "100");
        }
    }

    onTick(time: number): void {
        if (!this.characterManager.isCharacterBeingDragged() && !this.configurationMananger.getIsScreenOff())
            this.reactToSurfaceChange();

        this.currentTime = time;

        if (this.currentTime - this.lastDrawTime > 5000) {
            this.DrawAndPlayRandomNormalResource();
        }

        if (this.currentTime - this.lastHungerTime > 10000) {
            this.lastHungerTime = this.currentTime;
            this.Hungry();
        }
    }

    DrawAndPlayRandomNormalResource(): void {
        let random = Math.random();
        this.currentRandomDrawingCategory = "CHARACTER_ACTIVATION";
        this.actionManager.stopSound();

        if (random < 0.25) {
            this.currentRandomDrawingCategory = "reading";
        }
        else if (random < 0.50) {
            this.currentRandomDrawingCategory = "dancing";
        }
        else if (random < 0.75) {
            this.currentRandomDrawingCategory = "singing";
        }
        else {
            this.currentRandomDrawingCategory = "play_guitar";
        }

        this.lastDrawTime = this.configurationMananger.getCurrentTime().currentTimeMillis;
        this.drawAndPlayRandomResourceByCategory(this.currentRandomDrawingCategory);
    }

    Hungry(): void {
        this.Hp = this.Hp - 10;
        if (this.Hp < 0)
            this.Hp = 0;

        if (this.Hp < 50)
        {
            this.drawAndPlayRandomResourceByCategory("crying");
        }

        this.databaseManager.saveObject("health", this.Hp.toString());
        this.menuManager.setProperty("healthProgress", "progress", this.Hp.toString());
    }

    reactToSurfaceChange(): void {
        let speed = -999;
        let category = "";
        let angle = this.configurationMananger.getCurrentSurfaceAngle();
        let orientation = this.configurationMananger.getScreenOrientation();
        if (orientation == AgentConstants.ORIENTATION_PORTRAIT) {
            if (angle > 10 && angle < 70) {
                speed = angle - 10;
                category = AgentConstants.ON_FALLING_RIGHT;
            }
            else if (angle > 290 && angle < 350) {
                speed = angle - 350;
                category = AgentConstants.ON_FALLING_LEFT;
            }
        }
        else {
            if (angle > 280 && angle < 340) {
                speed = angle - 280;
                category = AgentConstants.ON_FALLING_RIGHT;
            }
            else if (angle > 200 && angle < 260) {
                speed = angle - 260;
                category = AgentConstants.ON_FALLING_LEFT;
            }
            else if (angle > 100 && angle < 160) {
                speed = angle - 100;
                category = AgentConstants.ON_FALLING_RIGHT;
            }
            else if (angle > 20 && angle < 80) {
                speed = angle - 80;
                category = AgentConstants.ON_FALLING_LEFT;
            }
        }

        if (speed != -999) {
            this.actionManager.stopSound();
            this.drawRandomResourceByCategory(category);
            if (Math.random() > 0.8)
                this.playRandomResourceByCategory(category);

            this.actionManager.move(speed, 0, 250);
        }
        //else {
        //    this.drawRandomResourceByCategory(AgentConstants.CHARACTER_ACTIVATION);..
        //}
    }

    onBackgroundTick(time: number) {
        this.onTick(time);
    }

    onActionReceived(categoryName: string, jsonedData: string): void {
        if (categoryName == "SCREEN_ON") {
            this.menuManager.setProperty("healthProgress", "progress", this.getHealth().toString());
        }

        this.actionManager.showMessage(categoryName + " received");
        this.drawAndPlayRandomResourceByCategory(categoryName);
    }

    onMove(oldX: number, oldY: number, newX: number, newY: number): void {
        let Xdiff = Math.abs(oldX - newX);
        let Ydiff = Math.abs(oldY - newY);
        if (Xdiff > Ydiff)
        {
            if (newX > oldX) {
                this.drawAndPlayRandomResourceByCategory(AgentConstants.ON_MOVE_RIGHT);
            }
            else {
                this.drawAndPlayRandomResourceByCategory(AgentConstants.ON_MOVE_LEFT);
            }
        }
        else {
            if (newY > oldY) {
                this.drawAndPlayRandomResourceByCategory(AgentConstants.ON_MOVE_DOWN);
            }
            else {
                this.drawAndPlayRandomResourceByCategory(AgentConstants.ON_MOVE_UP);
            }
        }
    }

    onRelease(currentX: number, currentY: number): void {
        this.drawAndPlayRandomResourceByCategory(AgentConstants.ON_RELEASE);
        let screenHeight = this.configurationMananger.getScreenHeight();
        if (currentY < screenHeight - 50) {
            this.actionManager.move(0, screenHeight - 50, 250);
        }
    }

    onPick(currentX: number, currentY: number): void {
        this.drawAndPlayRandomResourceByCategory(AgentConstants.ON_PICK);
    }

    onMenuItemSelected(itemName: string): void {
        if (itemName == "feedButton" || itemName == "drinkButton") {
            this.Hp = this.Hp + 10;
            if (this.Hp > 100)
                this.Hp = 100;

            this.lastEatingTime = this.configurationMananger.getCurrentTime().currentTimeMillis;
            if (itemName == "feedButton") {
                this.drawAndPlayRandomResourceByCategory("eating");
            }
            else {
                this.drawAndPlayRandomResourceByCategory("drinking");
            }

            this.databaseManager.saveObject("health", this.Hp.toString());
            this.menuManager.setProperty("healthProgress", "progress", this.Hp.toString());
        }
        else if (itemName == "tickleButton") {
            this.drawAndPlayRandomResourceByCategory("laughing");
        }
    }

    getHealth(): number {
        if (this.databaseManager.isObjectExist("health")) {
            return parseInt(this.databaseManager.getObject("health"));
        }

        return 100;
    }

    onConfigureMenuItems(menuBuilder: IMenuBuilder): void {
        let menuHeader = new MenuHeader();
        menuHeader.TextColor = "#ffffff";
        menuHeader.BackgroundColor = "#000000";
        
        let picture = new PictureMenuItem();
        picture.InitialX = 0;
        picture.InitialY = 0;
        picture.Height = 2;
        picture.Width = menuBuilder.getMaxColumns();
        picture.Name = "cover";
        picture.PictureResourceName = PictureMenuItem.UseCoverPicture;

        let health = this.getHealth();

        let progress = new ProgressBarMenuItem();
        progress.InitialX = 0;
        progress.InitialY = 2;
        progress.Height = 1;
        progress.Width = menuBuilder.getMaxColumns();
        progress.TextColor = "#FFFFFF";
        progress.BackgroundColor = "#000000";
        progress.Name = "healthProgress";
        progress.Progress = health;
        progress.MaxProgress = 100;
        progress.FrontColor = "#FF0000";

        let feedButton = new ButtonMenuItem();
        feedButton.InitialX = 0;
        feedButton.InitialY = 3;
        feedButton.BackgroundColor = "#000000";
        feedButton.Height = 1;
        feedButton.Name = "feedButton";
        feedButton.Text = "Food";
        feedButton.TextColor = "#FFFFFF";
        feedButton.Width = 2;

        let drinkButton = new ButtonMenuItem();
        drinkButton.InitialX = 2;
        drinkButton.InitialY = 3;
        drinkButton.BackgroundColor = "#000000";
        drinkButton.Height = 1;
        drinkButton.Name = "drinkButton";
        drinkButton.Text = "Drink";
        drinkButton.TextColor = "#FFFFFF";
        drinkButton.Width = 2;

        menuBuilder.createMenuHeader(menuHeader);
        menuBuilder.createPicture(picture);
        menuBuilder.createProgressBar(progress);
        menuBuilder.createButton(feedButton);
        menuBuilder.createButton(drinkButton);
    }

    onSpeechRecognitionResults(results: string): void { }

    onResponseReceived(response: string): void {
        this.actionManager.showMessage(response);
    }

    onLocationReceived(location: IAliveLocation): void {
        this.actionManager.showMessage("Location: Accuracy: " +
            location.getAccuracy().toString() +
            "| Bearing:" +
            location.getBearing().toString() +
            "| Latiture:" +
            location.getLatitude().toString() +
            "| Longitude:" +
            location.getLongitude().toString() +
            "| Speed:" +
            location.getSpeed().toString());
    }

    onUserActivityStateReceived(state: IAliveUserActivity) {
        this.actionManager.showMessage("UserActivity: State:" + state.getState() + " | Chance:" + state.getChance().toString());
    }

    onPlacesReceived(places: IAlivePlaceLikelihood[]): void {
        
    }

    onHeadphoneStateReceived(state: number) {

    }

    onWeatherReceived(weather: IAliveWeather) {
        this.actionManager.showMessage("Weather: Description:" +
            weather.getWeatherDescription() +
            "DewPoint:" +
            weather.getDewPoint() +
            weather.getDewPoint().toString() +
            " | FeelsLikeTemp:" +
            weather.getFeelsLikeTemperature().toString() +
            " | Humidity:" +
            weather.getHumidity().toString() +
            " | Temp:" +
            weather.getTemperature().toString());
    }

    drawAndPlayRandomResourceByCategory(categoryName: string): void {
        this.drawRandomResourceByCategory(categoryName);
        this.playRandomResourceByCategory(categoryName);
    }

    drawRandomResourceByCategory(categoryName: string): void {
        let image = this.resourceManagerHelper.chooseRandomImage(categoryName);
        if (image != null) {
            this.actionManager.draw(image, this.resizeRatio, false);
        }
    }

    playRandomResourceByCategory(categoryName: string): void {
        let sound = this.resourceManagerHelper.chooseRandomSound(categoryName);
        if (sound != null)
        {
            this.lastPlaySoundTime = this.currentTime;
            this.actionManager.playSound(sound);
        }
    }
}