/// <reference path="Scripts/collections.ts" />

class AliveClass implements IAliveAgent {
    // ReSharper disable once InconsistentNaming
    private static UNREGISTERED_CATEGORY_RESOURCE = -999;

    private lastPhoneEventOccurred: string;
    private lastUserInputTime: number;

    private actionManager: IActionManager;
    private resourceManager: IResourceManager;
    private databaseManager: IDatabaseManager;
    private characterManager: ICharacterManager;
    private menuManager: IMenuManager;
    private configurationManager: IConfigurationManager;
    private managersHandler: IManagersHandler;
    private resourceManagerHelper: ResourceManagerHelper;

    private categoryOnScreen: string;
    private lastVisabilityChangeTime: number;
    private sleeping: boolean;
    private visible: boolean;
    private deadPainted: boolean;
    private lastTime: number;
    private lastFallLeftTime: number;
    private lastFallRightTime: number;
    private currentTime: number;
    private lastDrawTime: number;
    private resizeRatio: number;

    private playerLoseMessages: string[];
    private playerWinMessages: string[];
    private cryingMessages: string[];

    private lastInteractionTime: number;

    private miniGame: MiniGame;
    private playingMiniGame: boolean;
    private noPlayPenaltyTime: number;
    private lastPlayGameClick: number;

    private menuInitialized: boolean;

    private foodCount: number;
    private drinkCount: number;

    private Hp: number;
    private lastEatingTime: number;
    private lastHungerTime: number;

    public constructor() {
        this.lastTime = 0;
        this.currentTime = 0;
        this.lastDrawTime = 0;
    }

    /**
     * This method gets called once when the character is being activated by the system.
     * @param handler An object that allows the code to get reference to the managers.
     * @param disabledPermissions A list of permissions that the user disabled.
     */
    onStart(handler: IManagersHandler, disabledPermissions: string[]): void {
        this.sleeping = false;
        this.menuInitialized = false;
        this.playingMiniGame = false;
        this.lastUserInputTime = 0;
        this.lastPhoneEventOccurred = "";
        this.managersHandler = handler;
        this.actionManager = handler.getActionManager();
        this.resourceManager = handler.getResourceManager();
        this.databaseManager = handler.getDatabaseManager();
        this.characterManager = handler.getCharacterManager();
        this.menuManager = handler.getMenuManager();
        this.configurationManager = handler.getConfigurationManager();
        this.resourceManagerHelper = new ResourceManagerHelper(this.resourceManager);
        this.actionManager.move(0, this.configurationManager.getScreenHeight(), 0);
        this.resizeRatio = this.configurationManager.getMaximalResizeRatio();
        this.drawAndPlayRandomResourceByCategory(AgentConstants.CHARACTER_ACTIVATION);
        this.lastHungerTime = this.configurationManager.getCurrentTime().currentTimeMillis;
        this.lastEatingTime = 0;
        this.lastPlayGameClick = 0;

        if (this.databaseManager.isObjectExist("health")) {
            this.Hp = parseInt(this.databaseManager.getObject("health"));
            this.menuManager.setProperty("healthProgress", "progress", this.Hp.toString());
        }
        else {
            this.Hp = 100;
            this.databaseManager.saveObject("health", "100");
        }

        this.playerWinMessages = ["You are very good at this game :) \nwe got another carrot :D", "Hm, i need more training xD \nwe got another carrot :D",
            "how did you win?!? \nwe got another carrot :D", "Yay! nice job! \nwe got another carrot :D",
            "Sweet! i knew you were training :D \nwe got another carrot :D"];

        this.playerLoseMessages = ["Num, that was easy! :P", "Nana Banana", "Nice round, but i still won :D",
            "Hahaha, maybe next time!", "I'm much better than you! :P"];

        this.cryingMessages = ["Feed me please! :(", "I'm so hungry :(", "There is nothing to eat or drink :'(",
            "You don't love me anymore! :( :(", "I thought we were friends! :'("];
    }

    initializeCounts(): void {
        let foodCount = this.databaseManager.getObject("foodCount");
        let drinkCount = this.databaseManager.getObject("drinkCount");

        if (foodCount == null) {
            this.databaseManager.saveObject("foodCount", "5");
            foodCount = "5";
        }

        if (drinkCount == null) {
            this.databaseManager.saveObject("drinkCount", "5");
            drinkCount = "5";
        }

        this.foodCount = parseInt(foodCount);
        this.drinkCount = parseInt(drinkCount);

        this.menuManager.setProperty("foodCount", "text", this.foodCount + " food left");
        this.menuManager.setProperty("drinkCount", "text", this.drinkCount + " drinks left");
    }

    checkTime(): void {
        let now = this.configurationManager.getCurrentTime();
        if (now.Hour >= 22 || now.Hour < 8) {
            this.sleeping = true;
        } else {
            this.sleeping = false;
        }
    }

    /**
     * This method gets called every 250 milliseconds by the system, any logic updates to the state of your character should occur here.
     * Note: onTick only gets called when the screen is ON.
     * @param time The current time (in milliseconds) on the device.
     */
    onTick(time: number): void {
        this.currentTime = time;
        if (this.playingMiniGame) {
            this.miniGame.onTick(time);
            return;
        }

        this.checkTime();

        if (this.sleeping)
        {
            this.drawAndPlayRandomResourceByCategory("sleeping");
            return;
        }

        if (!this.menuInitialized) {
            this.menuInitialized = true;
            this.initializeCounts();
        }

        if (!this.characterManager.isCharacterBeingDragged() && !this.configurationManager.isScreenOff())
            this.reactToSurfaceChange();

        this.currentTime = time;

        if (this.currentTime - this.lastDrawTime > 5000) {
            this.DrawAndPlayRandomNormalResource();
        }

        if (this.currentTime - this.lastHungerTime > 100000) {
            this.lastHungerTime = this.currentTime;
            this.Hungry();
        }
    }

    /**
     * This method updates the local database and the menu text.
     * Note: this method only gets called when the screen is OFF.
     * @param time The current time (in milliseconds) on the device.
     */
    updateCounts(): void {
        this.menuManager.setProperty("foodCount", "text", this.foodCount + " food left");
        this.menuManager.setProperty("drinkCount", "text", this.drinkCount + " drinks left");
        this.databaseManager.saveObject("foodCount", this.foodCount.toString());
        this.databaseManager.saveObject("drinkCount", this.drinkCount.toString());
    }

    /**
     * This method gets called by the system every 1 hour (may be in a different rate depending on the device).
     * Note: this method only gets called when the screen is OFF.
     * @param time The current time (in milliseconds) on the device.
     */
    onBackgroundTick(time: number) {
        this.onTick(time);
    }

    /**
     * This method have a chance of 85% to draw and play a sound that is related to a category
         except the eating, drinking and laughing categories.
     */
    DrawAndPlayRandomNormalResource(): void {
        let random = Math.random();
        let randomCategory = "CHARACTER_ACTIVATION";
        this.actionManager.stopSound();
        if (random > 0.85) {
            let allCharacterCategories = this.resourceManager.getAllResourceCategories();
            allCharacterCategories.splice(allCharacterCategories.indexOf('eating'), 1);
            allCharacterCategories.splice(allCharacterCategories.indexOf('drinking'), 1);
            allCharacterCategories.splice(allCharacterCategories.indexOf('laughing'), 1);

            let randomIndex = Math.floor(Math.random() * (allCharacterCategories.length - 1));

            randomCategory = allCharacterCategories[randomIndex];
        }

        this.lastDrawTime = this.configurationManager.getCurrentTime().currentTimeMillis;
        this.drawAndPlayRandomResourceByCategory(randomCategory);
    }

    /**
     * This method reduce the health of the character by 10.
       The health of the character is shown by the progress bar in the character menu.
     */
    Hungry(): void {
        this.Hp = this.Hp - 10;
        if (this.Hp < 0)
            this.Hp = 0;

        if (this.Hp < 50) {
            this.drawAndPlayRandomResourceByCategory("crying");
            let messageIndex = Math.floor(Math.random() * 4);
            this.actionManager.showMessage(this.cryingMessages[messageIndex], "#FF0000", "#eeeeee", 2000);
        }

        this.databaseManager.saveObject("health", this.Hp.toString());
        this.menuManager.setProperty("healthProgress", "progress", this.Hp.toString());
    }

    /**
     * This method will move your character on the screen depending on the surface angle of the phone.
     */
    reactToSurfaceChange(): void {
        let speed = -999;
        let category = "";
        let angle = this.configurationManager.getCurrentSurfaceAngle();
        let orientation = this.configurationManager.getScreenOrientation();
        if (orientation == AgentConstants.ORIENTATION_PORTRAIT) {
            if (angle > 10 && angle < 70) {
                speed = angle - 10;
                category = AgentConstants.ON_FALLING_RIGHT;
            }
            else if (angle > 290 && angle < 350) {
                speed = angle - 350;
                category = AgentConstants.ON_FALLING_LEFT;
            }
            else {
                category = AgentConstants.CHARACTER_ACTIVATION;
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

        let canChangeMode = this.currentTime - this.lastUserInputTime > 5000
            && this.currentTime - this.lastDrawTime > 5000;

        if (!canChangeMode)
            return;

        if (speed != -999) {
            this.actionManager.stopSound();
            this.drawRandomResourceByCategory(category);

            this.actionManager.move(speed, 0, 250);
        }
        else {
            this.drawRandomResourceByCategory(AgentConstants.CHARACTER_ACTIVATION);
        }
    }

    /**
     * This method gets called whenever a phone event (that you registered to) occur on the phone.
     * @param eventName The name of the event that occurred.
     * @param jsonedData The data of the event that occurred.
     * For example, SMS_RECEIVED event will hold data about who sent the SMS, and the SMS content.
     */
    onPhoneEventOccurred(eventName: string, jsonedData: string): void {
        eventName = eventName.toUpperCase();
        if (eventName == "SCREEN_ON") {
            this.menuManager.setProperty("healthProgress", "progress", this.getHealth().toString());
        } else if (eventName == "CHARACTER_ACTIVATION") {
            this.actionManager.showMessage("Hi there! :D", "#00FF00", "#eeeeee", 2000);
        }
        else
            this.actionManager.showMessage(eventName + " received", "#000000", "#eeeeee", 2000);

        this.drawAndPlayRandomResourceByCategory(eventName);
    }

    /**
     * This method gets called when the user is holding and moving the image of your character (on screen).
     * @param oldX The X coordinate in the last tick (Top left).
     * @param oldY The Y coordinate in the last tick (Top left).
     * @param newX The X coordinate in the current tick (Top left).
     * @param newY The Y coordinate in the current tick (Top left).
     */
    onMove(oldX: number, oldY: number, newX: number, newY: number): void {
        let Xdiff = Math.abs(oldX - newX);
        let Ydiff = Math.abs(oldY - newY);
        if (Xdiff > Ydiff) {
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

    /**
     * This method gets called when the user raised his finger off the character image (on screen).
     * @param currentX The X coordinate of the character image on screen (Top left).
     * @param currentY The Y coordinate of the character image on the screen (Top left).
     */
    onRelease(currentX: number, currentY: number): void {
        if (this.playingMiniGame) return;
        
        let screenHeight = this.configurationManager.getScreenHeight();
        if (currentY < screenHeight - 50) {
            this.actionManager.move(0, screenHeight - 50, 250);
        }
        this.drawAndPlayRandomResourceByCategory(AgentConstants.ON_RELEASE);
    }

    /**
     * This method gets called whenever the user is holding the character image (on screen).
     * @param currentX The current X coordinate of the character image (Top left).
     * @param currentY The current Y coordinate of the character image (Top left).
     */
    onPick(currentX: number, currentY: number): void {
        if (this.playingMiniGame) {
            this.miniGame.onEventOccured("touch");
            return;
        }
        this.drawAndPlayRandomResourceByCategory(AgentConstants.ON_PICK);
    }

    /**
     * This method gets called whenever the user has pressed a view in the character menu.
     * @param viewName The 'Name' property of the view that was pressed.
     */
    onMenuItemSelected(viewName: string): void {
        this.lastInteractionTime = this.currentTime;
        if (viewName == "feedButton" || viewName == "drinkButton") {
            if (this.playingMiniGame) return;
            this.lastUserInputTime = this.configurationManager.getCurrentTime().currentTimeMillis;

            this.lastEatingTime = this.configurationManager.getCurrentTime().currentTimeMillis;
            if (viewName == "feedButton") {
                if (this.foodCount <= 0)
                {
                    this.actionManager.showMessage("We don't have anymore food, please play with me to earn some", "#000000", "#aaaaaa", 2000);
                    return;
                }
                this.foodCount -= 1;
                this.drawAndPlayRandomResourceByCategory("eating");
            }
            else {
                if (this.drinkCount <= 0) {
                    this.actionManager.showMessage("We don't have anymore drinks, please play with me to earn some", "#000000", "#aaaaaa", 2000);
                    return;
                }
                this.drinkCount -= 1;
                this.drawAndPlayRandomResourceByCategory("drinking");
            }

            this.updateCounts();

            this.Hp = this.Hp + 10;
            if (this.Hp > 100)
                this.Hp = 100;

            this.databaseManager.saveObject("health", this.Hp.toString());
            this.menuManager.setProperty("healthProgress", "progress", this.Hp.toString());
        }
        else if (viewName == "playButton") {
            if (this.playingMiniGame) {
                this.miniGame.onEventOccured("stop");
            }
            else {
                let now = this.currentTime;
                if (now - this.lastPlayGameClick < 2000)
                    return;

                this.lastPlayGameClick = now;
                this.playRandomMiniGame(now);
            }
        }
    }

    playRandomMiniGame(currentTime: number): void {
        if (this.playingMiniGame) return;

        if (currentTime < this.noPlayPenaltyTime) {
            this.actionManager.showMessage("I said that i don't want to play right now!!", "#4C4D4F", "#ffffff", 2000);
            this.noPlayPenaltyTime = currentTime + 10000;
            return;
        }

        if (Math.random() > 0.6) {
            this.actionManager.showMessage("I don't want to play right now..", "#4C4D4F", "#ffffff", 2000);
            this.noPlayPenaltyTime = currentTime + 10000;
            return;
        }

        this.menuManager.setProperty("healthLabel", "text", "Game:");
        this.menuManager.setProperty("playButton", "Text", "Surrender");
        this.playingMiniGame = true;
        let randomNumber = Math.random() * 100;

        if (randomNumber <= 50) {
            this.miniGame = new CatchMiniGame(this.managersHandler, this.resourceManagerHelper,
                (playerWon: boolean) => {
                    this.miniGameOver(playerWon);
                });
        }
        else {
            this.miniGame = new HideAndSeekMiniGame(this.managersHandler,
                (playerWon: boolean) => {
                    this.miniGameOver(playerWon);
                });
        }

        this.miniGame.onStart(this.configurationManager.getCurrentTime().currentTimeMillis);
    }

    private miniGameOver(playerWon: boolean): void {
        this.actionManager.move(-this.configurationManager.getScreenWidth(), this.configurationManager.getScreenHeight(), 20);
        this.playingMiniGame = false;

        let messageIndex = Math.floor(Math.random() * 4);

        this.actionManager.animateAlpha(1, 0);
        this.drawAndPlayRandomResourceByCategory("laughing");

        if (playerWon) {
            this.foodCount += 1;
            this.drinkCount += 1;
            this.updateCounts();
            this.actionManager.showMessage(this.playerWinMessages[messageIndex], "#91CA63", "#ffffff", 5000);
        }
        else {
            this.actionManager.showMessage(this.playerLoseMessages[messageIndex], "#EC2027", "#ffffff", 5000);
        }

        this.menuManager.setProperty("playButton", "Text", "Let's play!");
        this.menuManager.setProperty("healthLabel", "text", "Health:");
        this.menuManager.setProperty("healthProgress", "progress", this.Hp.toString());
        this.menuManager.setProperty("healthProgress", "frontcolor", "#FF0000");
    }

    /**
     * This method returns the current health of the character from the local database.
     */
    getHealth(): number {
        if (this.databaseManager.isObjectExist("health")) {
            return parseInt(this.databaseManager.getObject("health"));
        }

        return 100;
    }

    /**
     * This method gets called once just before the onStart method and is where the character menu views are defined.
     * @param menuBuilder An object that fills the character menu.
     */
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

        let healthLabel = new TextBoxMenuItem();
        healthLabel.InitialX = 0;
        healthLabel.InitialY = 2;
        healthLabel.Height = 1;
        healthLabel.Width = 1;
        healthLabel.Name = "healthLabel";
        healthLabel.Text = "Health:";
        healthLabel.TextColor = "#FF0000";
        healthLabel.BackgroundColor = "#000000";

        let progress = new ProgressBarMenuItem();
        progress.InitialX = 1;
        progress.InitialY = 2;
        progress.Height = 1;
        progress.Width = 3;
        progress.TextColor = "#FFFFFF";
        progress.FrontColor = "#FF0000";
        progress.BackgroundColor = "#000000";
        progress.Name = "healthProgress";
        progress.Progress = health;
        progress.MaxProgress = 100;

        let feedButton = new ButtonMenuItem();
        feedButton.InitialX = 0;
        feedButton.InitialY = 3;
        feedButton.Height = 1;
        feedButton.Width = 1;
        feedButton.Name = "feedButton";
        feedButton.Text = "Feed:";
        feedButton.TextColor = "#FF0000";
        feedButton.BackgroundColor = "#000000";

        let foodCount = new TextBoxMenuItem();
        foodCount.InitialX = 1;
        foodCount.InitialY = 3;
        foodCount.Height = 1;
        foodCount.Width = 3;
        foodCount.Name = "foodCount";
        foodCount.Text = "5 food left";
        foodCount.TextColor = "#FF0000";
        foodCount.BackgroundColor = "#000000";

        let drinkButton = new ButtonMenuItem();
        drinkButton.InitialX = 0;
        drinkButton.InitialY = 4;
        drinkButton.Height = 1;
        drinkButton.Width = 1;
        drinkButton.Name = "drinkButton";
        drinkButton.Text = "Drink:";
        drinkButton.TextColor = "#FF0000";
        drinkButton.BackgroundColor = "#000000";

        let drinkCount = new TextBoxMenuItem();
        drinkCount.InitialX = 1;
        drinkCount.InitialY = 4;
        drinkCount.Height = 1;
        drinkCount.Width = 3;
        drinkCount.Name = "drinkCount";
        drinkCount.Text = "5 drinks left";
        drinkCount.TextColor = "#FF0000";
        drinkCount.BackgroundColor = "#000000";

        let playButton = new ButtonMenuItem();
        playButton.InitialX = 0;
        playButton.InitialY = 5;
        playButton.Height = 1;
        playButton.Width = menuBuilder.getMaxColumns();
        playButton.Name = "playButton";
        playButton.Text = "Let's play!";
        playButton.TextColor = "#FF0000";
        playButton.BackgroundColor = "#000000";

        menuBuilder.createMenuHeader(menuHeader);
        menuBuilder.createPicture(picture);
        menuBuilder.createProgressBar(progress);
        menuBuilder.createButton(drinkButton);
        menuBuilder.createButton(feedButton);
        menuBuilder.createButton(playButton);
        menuBuilder.createTextBox(foodCount);
        menuBuilder.createTextBox(drinkCount);
        menuBuilder.createTextBox(healthLabel);
    }

    /**
     * This method gets called when the system done processing the speech recognition input.
     * @param results A stringed version of what the user said.
     */
    onSpeechRecognitionResults(results: string): void { }

    /**
     * This method is called when the system received a reply from a previously HTTP request made by the character.
     * @param response The reply body in a JSON form.
     */
    onResponseReceived(response: string): void {
        this.actionManager.showMessage(response, "#000000", "#eeeeee", 2000);
    }

    /**
     * This method gets called when the system done collecting information about the device location.
     * @param location The location information collected by the system.
     */
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
            location.getSpeed().toString(), "#000000", "#eeeeee", 2000);
    }

    /**
     * This method gets called when the system done collecting information about the user activity.
     * @param state Information about the user activity.
     * Possible states: IN_VEHICLE, ON_BICYCLE, ON_FOOT, STILL, TILTING, WALKING, RUNNING, UNKNOWN.
     */
    onUserActivityStateReceived(state: IAliveUserActivity) {
        this.actionManager.showMessage("UserActivity: State:" + state.getState() + " | Chance:" + state.getChance().toString(), "#000000", "#eeeeee", 2000);
    }

    /**
     * This method gets called when the system done collecting information about nearby places around the device.
     * @param places A list of places that are near the device.
     */
    onPlacesReceived(places: IAlivePlaceLikelihood[]): void {

    }

    /**
     * This method gets called when the system done collecting information about the headphone state.
     * @param state 1 - the headphones are PLUGGED, 2 - the headphones are UNPLUGGED.
     */
    onHeadphoneStateReceived(state: number) {

    }

    /**
     * This method gets called when the system done collecting information about the weather in the location of the device.
     * @param weather Information about the weather.
     */
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
            weather.getTemperature().toString(), "#000000", "#eeeeee", 2000);
    }

    /**
     * This method will draw a random image to the screen and play a random sound, filtered by the category name.
     * @param categoryName The name of the category that will be used as a filter.
     */
    drawAndPlayRandomResourceByCategory(categoryName: string): void {
        this.drawRandomResourceByCategory(categoryName);
        this.playRandomResourceByCategory(categoryName);
    }

    /**
     * This method will draw a random image to the screen from the character resources.
     * @param categoryName The name of the category that the image resource belongs to.
     */
    drawRandomResourceByCategory(categoryName: string): void {
        if (categoryName == this.categoryOnScreen) return;

        this.categoryOnScreen = categoryName;
        let image = this.resourceManagerHelper.chooseRandomImage(categoryName);
        if (image != null) {
            this.actionManager.draw(image, this.resizeRatio, false);
        }
    }

    /**
     * This method will play a random sound from the character resources.
     * @param categoryName The name of the category that the sound resource belongs to.
     */
    playRandomResourceByCategory(categoryName: string): void {
        if (this.lastPhoneEventOccurred == categoryName && this.configurationManager.isSoundPlaying())
            return;

        this.actionManager.stopSound();
        this.lastPhoneEventOccurred = categoryName;
        let sound = this.resourceManagerHelper.chooseRandomSound(categoryName);
        if (sound != null) {
            this.actionManager.playSound(sound, false);
        }
    }

    /**
     * This method will be called once a user event will occur.
     * You can use AgentConstants.APPLICATION_EVENT_x to check which event occurred.
     * @param eventName The name of the event, compare this to AgentConstants.APPLICATION_EVENT_x.
     * @param jsonedData Extra data about the event.
     */
    onUserEventOccurred(eventName: string, jsonedData: string): void {

    }
}