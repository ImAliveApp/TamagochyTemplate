var AliveClass = (function () {
    function AliveClass() {
        this.lastTime = 0;
        this.currentTime = 0;
        this.lastDrawTime = 0;
    }
    AliveClass.prototype.onStart = function (handler, disabledPermissions) {
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
    };
    AliveClass.prototype.initializeCounts = function () {
        var foodCount = this.databaseManager.getObject("foodCount");
        var drinkCount = this.databaseManager.getObject("drinkCount");
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
    };
    AliveClass.prototype.checkTime = function () {
        var now = this.configurationManager.getCurrentTime();
        if (now.Hour >= 22 || now.Hour < 8) {
            this.sleeping = true;
        }
        else {
            this.sleeping = false;
        }
    };
    AliveClass.prototype.onTick = function (time) {
        this.currentTime = time;
        if (this.playingMiniGame) {
            this.miniGame.onTick(time);
            return;
        }
        this.checkTime();
        if (this.sleeping) {
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
    };
    AliveClass.prototype.updateCounts = function () {
        this.menuManager.setProperty("foodCount", "text", this.foodCount + " food left");
        this.menuManager.setProperty("drinkCount", "text", this.drinkCount + " drinks left");
        this.databaseManager.saveObject("foodCount", this.foodCount.toString());
        this.databaseManager.saveObject("drinkCount", this.drinkCount.toString());
    };
    AliveClass.prototype.onBackgroundTick = function (time) {
        this.onTick(time);
    };
    AliveClass.prototype.DrawAndPlayRandomNormalResource = function () {
        var random = Math.random();
        this.currentRandomDrawingCategory = "CHARACTER_ACTIVATION";
        this.actionManager.stopSound();
        if (random > 0.85) {
            var allCharacterCategories = this.resourceManager.getAllResourceCategories();
            allCharacterCategories.splice(allCharacterCategories.indexOf('eating'), 1);
            allCharacterCategories.splice(allCharacterCategories.indexOf('drinking'), 1);
            allCharacterCategories.splice(allCharacterCategories.indexOf('laughing'), 1);
            var randomIndex = Math.floor(Math.random() * (allCharacterCategories.length - 1));
            this.currentRandomDrawingCategory = allCharacterCategories[randomIndex];
        }
        this.lastDrawTime = this.configurationManager.getCurrentTime().currentTimeMillis;
        this.drawAndPlayRandomResourceByCategory(this.currentRandomDrawingCategory);
    };
    AliveClass.prototype.Hungry = function () {
        this.Hp = this.Hp - 10;
        if (this.Hp < 0)
            this.Hp = 0;
        if (this.Hp < 50) {
            this.drawAndPlayRandomResourceByCategory("crying");
            var messageIndex = Math.floor(Math.random() * 4);
            this.actionManager.showMessage(this.cryingMessages[messageIndex], "#FF0000", "#eeeeee", 2000);
        }
        this.databaseManager.saveObject("health", this.Hp.toString());
        this.menuManager.setProperty("healthProgress", "progress", this.Hp.toString());
    };
    AliveClass.prototype.reactToSurfaceChange = function () {
        var speed = -999;
        var category = "";
        var angle = this.configurationManager.getCurrentSurfaceAngle();
        var orientation = this.configurationManager.getScreenOrientation();
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
        var canChangeMode = this.currentTime - this.lastUserInputTime > 5000
            && this.currentTime - this.lastDrawTime > 5000;
        if (!canChangeMode)
            return;
        if (speed != -999) {
            this.actionManager.stopSound();
            this.drawRandomResourceByCategory(category);
            if (Math.random() > 0.8)
                this.playRandomResourceByCategory(category);
            this.actionManager.move(speed, 0, 250);
        }
        else {
            this.drawRandomResourceByCategory(AgentConstants.CHARACTER_ACTIVATION);
        }
    };
    AliveClass.prototype.onPhoneEventOccurred = function (eventName, jsonedData) {
        eventName = eventName.toUpperCase();
        if (eventName == "SCREEN_ON") {
            this.menuManager.setProperty("healthProgress", "progress", this.getHealth().toString());
        }
        else if (eventName == "CHARACTER_ACTIVATION") {
            this.actionManager.showMessage("Hi there! :D", "#00FF00", "#eeeeee", 2000);
        }
        else
            this.actionManager.showMessage(eventName + " received", "#000000", "#eeeeee", 2000);
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
        if (this.playingMiniGame)
            return;
        var screenHeight = this.configurationManager.getScreenHeight();
        if (currentY < screenHeight - 50) {
            this.actionManager.move(0, screenHeight - 50, 250);
        }
        this.drawAndPlayRandomResourceByCategory(AgentConstants.ON_RELEASE);
    };
    AliveClass.prototype.onPick = function (currentX, currentY) {
        if (this.playingMiniGame) {
            this.miniGame.onEventOccured("touch");
            return;
        }
        this.drawAndPlayRandomResourceByCategory(AgentConstants.ON_PICK);
    };
    AliveClass.prototype.onMenuItemSelected = function (viewName) {
        this.lastInteractionTime = this.currentTime;
        if (viewName == "feedButton" || viewName == "drinkButton") {
            if (this.playingMiniGame)
                return;
            this.lastUserInputTime = this.configurationManager.getCurrentTime().currentTimeMillis;
            this.lastEatingTime = this.configurationManager.getCurrentTime().currentTimeMillis;
            if (viewName == "feedButton") {
                if (this.foodCount <= 0) {
                    this.actionManager.showMessage("You have no food, please play with me to earn some", "#000000", "#aaaaaa", 2000);
                    return;
                }
                this.foodCount -= 1;
                this.drawAndPlayRandomResourceByCategory("eating");
            }
            else {
                if (this.drinkCount <= 0) {
                    this.actionManager.showMessage("You have no food, please play with me to earn some", "#000000", "#aaaaaa", 2000);
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
                var now = this.currentTime;
                if (now - this.lastPlayGameClick < 2000)
                    return;
                this.lastPlayGameClick = now;
                this.playRandomMiniGame(now);
            }
        }
    };
    AliveClass.prototype.playRandomMiniGame = function (currentTime) {
        var _this = this;
        if (this.playingMiniGame)
            return;
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
        var randomNumber = Math.random() * 100;
        if (randomNumber <= 50) {
            this.miniGame = new CatchMiniGame(this.managersHandler, this.resourceManagerHelper, function (playerWon) {
                _this.miniGameOver(playerWon);
            });
        }
        else {
            this.miniGame = new HideAndSeekMiniGame(this.managersHandler, function (playerWon) {
                _this.miniGameOver(playerWon);
            });
        }
        this.miniGame.onStart(this.configurationManager.getCurrentTime().currentTimeMillis);
    };
    AliveClass.prototype.miniGameOver = function (playerWon) {
        this.actionManager.move(-this.configurationManager.getScreenWidth(), this.configurationManager.getScreenHeight(), 20);
        this.playingMiniGame = false;
        var messageIndex = Math.floor(Math.random() * 4);
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
        var healthLabel = new TextBoxMenuItem();
        healthLabel.InitialX = 0;
        healthLabel.InitialY = 2;
        healthLabel.Height = 1;
        healthLabel.Width = 1;
        healthLabel.Name = "healthLabel";
        healthLabel.Text = "Health:";
        healthLabel.TextColor = "#FF0000";
        healthLabel.BackgroundColor = "#000000";
        var progress = new ProgressBarMenuItem();
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
        var feedButton = new ButtonMenuItem();
        feedButton.InitialX = 0;
        feedButton.InitialY = 3;
        feedButton.Height = 1;
        feedButton.Width = 1;
        feedButton.Name = "feedButton";
        feedButton.Text = "Feed:";
        feedButton.TextColor = "#FF0000";
        feedButton.BackgroundColor = "#000000";
        var foodCount = new TextBoxMenuItem();
        foodCount.InitialX = 1;
        foodCount.InitialY = 3;
        foodCount.Height = 1;
        foodCount.Width = 3;
        foodCount.Name = "foodCount";
        foodCount.Text = "5 food left";
        foodCount.TextColor = "#FF0000";
        foodCount.BackgroundColor = "#000000";
        var drinkButton = new ButtonMenuItem();
        drinkButton.InitialX = 0;
        drinkButton.InitialY = 4;
        drinkButton.Height = 1;
        drinkButton.Width = 1;
        drinkButton.Name = "drinkButton";
        drinkButton.Text = "Drink:";
        drinkButton.TextColor = "#FF0000";
        drinkButton.BackgroundColor = "#000000";
        var drinkCount = new TextBoxMenuItem();
        drinkCount.InitialX = 1;
        drinkCount.InitialY = 4;
        drinkCount.Height = 1;
        drinkCount.Width = 3;
        drinkCount.Name = "drinkCount";
        drinkCount.Text = "5 drinks left";
        drinkCount.TextColor = "#FF0000";
        drinkCount.BackgroundColor = "#000000";
        var playButton = new ButtonMenuItem();
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
    };
    AliveClass.prototype.onSpeechRecognitionResults = function (results) { };
    AliveClass.prototype.onResponseReceived = function (response) {
        this.actionManager.showMessage(response, "#000000", "#eeeeee", 2000);
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
            location.getSpeed().toString(), "#000000", "#eeeeee", 2000);
    };
    AliveClass.prototype.onUserActivityStateReceived = function (state) {
        this.actionManager.showMessage("UserActivity: State:" + state.getState() + " | Chance:" + state.getChance().toString(), "#000000", "#eeeeee", 2000);
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
            weather.getTemperature().toString(), "#000000", "#eeeeee", 2000);
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
        if (this.lastPhoneEventOccurred == categoryName && this.configurationManager.isSoundPlaying())
            return;
        this.actionManager.stopSound();
        this.lastPhoneEventOccurred = categoryName;
        var sound = this.resourceManagerHelper.chooseRandomSound(categoryName);
        if (sound != null) {
            this.actionManager.playSound(sound, false);
        }
    };
    return AliveClass;
}());
AliveClass.UNREGISTERED_CATEGORY_RESOURCE = -999;
//# sourceMappingURL=app.js.map