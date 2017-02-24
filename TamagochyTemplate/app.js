/// <reference path="Scripts/collections.ts" />
var AliveClass = (function () {
    function AliveClass() {
        this.lastTime = 0;
        this.currentTime = 0;
        this.lastDrawTime = 0;
        this.lastPlaySoundTime = 0;
    }
    AliveClass.prototype.onStart = function (handler, disabledPermissions) {
        this.actionManager = handler.getActionManager();
        this.resourceManager = handler.getResourceManager();
        this.databaseManager = handler.getDatabaseManager();
        this.characterManager = handler.getCharacterManager();
        this.menuManager = handler.getMenuManager();
        this.configurationMananger = handler.getConfigurationManager();
        this.restManager = handler.getRestManager();
        this.awarenessManager = handler.getAwarenessManager();
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
    };
    AliveClass.prototype.onTick = function (time) {
        if (!this.characterManager.isCharacterBeingDragged() && !this.configurationMananger.isScreenOff())
            this.reactToSurfaceChange();
        this.currentTime = time;
        if (this.currentTime - this.lastDrawTime > 5000) {
            this.DrawAndPlayRandomNormalResource();
        }
        if (this.currentTime - this.lastHungerTime > 10000) {
            this.lastHungerTime = this.currentTime;
            this.Hungry();
        }
    };
    AliveClass.prototype.DrawAndPlayRandomNormalResource = function () {
        var random = Math.random();
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
    };
    AliveClass.prototype.Hungry = function () {
        this.Hp = this.Hp - 10;
        if (this.Hp < 0)
            this.Hp = 0;
        if (this.Hp < 50) {
            this.drawAndPlayRandomResourceByCategory("crying");
        }
        this.databaseManager.saveObject("health", this.Hp.toString());
        this.menuManager.setProperty("healthProgress", "progress", this.Hp.toString());
    };
    AliveClass.prototype.reactToSurfaceChange = function () {
        var speed = -999;
        var category = "";
        var angle = this.configurationMananger.getCurrentSurfaceAngle();
        var orientation = this.configurationMananger.getScreenOrientation();
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
    };
    AliveClass.prototype.onBackgroundTick = function (time) {
        this.onTick(time);
    };
    AliveClass.prototype.onEventOccurred = function (eventName, jsonedData) {
        if (eventName == "SCREEN_ON") {
            this.menuManager.setProperty("healthProgress", "progress", this.getHealth().toString());
        }
        this.actionManager.showMessage(eventName + " received");
        this.drawAndPlayRandomResourceByCategory(eventName);
    };
    AliveClass.prototype.onMove = function (oldX, oldY, newX, newY) {
        var Xdiff = Math.abs(oldX - newX);
        var Ydiff = Math.abs(oldY - newY);
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
    };
    AliveClass.prototype.onRelease = function (currentX, currentY) {
        this.drawAndPlayRandomResourceByCategory(AgentConstants.ON_RELEASE);
        var screenHeight = this.configurationMananger.getScreenHeight();
        if (currentY < screenHeight - 50) {
            this.actionManager.move(0, screenHeight - 50, 250);
        }
    };
    AliveClass.prototype.onPick = function (currentX, currentY) {
        this.drawAndPlayRandomResourceByCategory(AgentConstants.ON_PICK);
    };
    AliveClass.prototype.onMenuItemSelected = function (itemName) {
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
    };
    AliveClass.prototype.getHealth = function () {
        if (this.databaseManager.isObjectExist("health")) {
            return parseInt(this.databaseManager.getObject("health"));
        }
        return 100;
    };
    AliveClass.prototype.onConfigureMenuItems = function (menuBuilder) {
        var menuHeader = new MenuHeader();
        menuHeader.TextColor = "#ffffff";
        menuHeader.BackgroundColor = "#000000";
        var picture = new PictureMenuItem();
        picture.InitialX = 0;
        picture.InitialY = 0;
        picture.Height = 2;
        picture.Width = menuBuilder.getMaxColumns();
        picture.Name = "cover";
        picture.PictureResourceName = PictureMenuItem.UseCoverPicture;
        var health = this.getHealth();
        var progress = new ProgressBarMenuItem();
        progress.InitialX = 0;
        progress.InitialY = 2;
        progress.Height = 1;
        progress.Width = menuBuilder.getMaxColumns();
        progress.TextColor = "#FFFFFF";
        progress.FrontColor = "#F56CA4";
        progress.BackgroundColor = "#000000";
        progress.Name = "healthProgress";
        progress.Progress = health;
        progress.MaxProgress = 100;
        var button = new ButtonMenuItem();
        button.InitialX = 0;
        button.InitialY = 3;
        button.Height = 1;
        button.Width = 2;
        button.Name = "button";
        button.Text = "Example";
        button.TextColor = "#FFFFFF";
        button.BackgroundColor = "#F56CA4";
        var checkBox = new CheckBoxMenuItem();
        checkBox.InitialX = 2;
        checkBox.InitialY = 3;
        checkBox.Height = 1;
        checkBox.Width = 2;
        checkBox.Name = "checkBox";
        checkBox.Text = "Checked";
        checkBox.TextColor = "#FFFFFF";
        checkBox.FrontColor = "#F56CA4";
        checkBox.BackgroundColor = "#000000";
        checkBox.Checked = true;
        checkBox.UncheckedText = "Unchecked";
        var textBox = new TextBoxMenuItem();
        textBox.InitialX = 0;
        textBox.InitialY = 4;
        textBox.Height = 1;
        textBox.Width = 2;
        textBox.Name = "textBox";
        textBox.Text = "Example";
        textBox.TextColor = "#F56CA4";
        textBox.BackgroundColor = "#000000";
        menuBuilder.createMenuHeader(menuHeader);
        menuBuilder.createPicture(picture);
        menuBuilder.createProgressBar(progress);
        menuBuilder.createButton(button);
        menuBuilder.createCheckBox(checkBox);
        menuBuilder.createTextBox(textBox);
    };
    AliveClass.prototype.onSpeechRecognitionResults = function (results) { };
    AliveClass.prototype.onResponseReceived = function (response) {
        this.actionManager.showMessage(response);
    };
    AliveClass.prototype.onLocationReceived = function (location) {
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
    };
    AliveClass.prototype.onUserActivityStateReceived = function (state) {
        this.actionManager.showMessage("UserActivity: State:" + state.getState() + " | Chance:" + state.getChance().toString());
    };
    AliveClass.prototype.onPlacesReceived = function (places) {
    };
    AliveClass.prototype.onHeadphoneStateReceived = function (state) {
    };
    AliveClass.prototype.onWeatherReceived = function (weather) {
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
    };
    AliveClass.prototype.drawAndPlayRandomResourceByCategory = function (categoryName) {
        this.drawRandomResourceByCategory(categoryName);
        this.playRandomResourceByCategory(categoryName);
    };
    AliveClass.prototype.drawRandomResourceByCategory = function (categoryName) {
        var image = this.resourceManagerHelper.chooseRandomImage(categoryName);
        if (image != null) {
            this.actionManager.draw(image, this.resizeRatio, false);
        }
    };
    AliveClass.prototype.playRandomResourceByCategory = function (categoryName) {
        var sound = this.resourceManagerHelper.chooseRandomSound(categoryName);
        if (sound != null) {
            this.lastPlaySoundTime = this.currentTime;
            this.actionManager.playSound(sound);
        }
    };
    // ReSharper disable once InconsistentNaming
    AliveClass.UNREGISTERED_CATEGORY_RESOURCE = -999;
    return AliveClass;
}());
//# sourceMappingURL=app.js.map