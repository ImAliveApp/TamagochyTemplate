var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MiniGame = (function () {
    function MiniGame() {
    }
    return MiniGame;
}());
var CatchMiniGame = (function (_super) {
    __extends(CatchMiniGame, _super);
    function CatchMiniGame(handler, resourceHelper, finishCallback) {
        var _this = _super.call(this) || this;
        _this.menuManager = handler.getMenuManager();
        _this.actionManager = handler.getActionManager();
        _this.characterManager = handler.getCharacterManager();
        _this.configurationManager = handler.getConfigurationManager();
        _this.resourceHelper = resourceHelper;
        _this.finishCallback = finishCallback;
        return _this;
    }
    CatchMiniGame.prototype.onStart = function (currentTime) {
        this.lastDecreaseTime = currentTime;
        this.touches = 1;
        this.progress = 50;
        this.difficulty = Math.random() * 100;
        var difficultyTrimmed = this.difficulty.toString().substring(0, 4);
        this.actionManager.showMessage("This is a catch game! i will walk around the screen, and you will need to catch me :D "
            + "\nOnce the progress bar in the menu will reach 100%, you will win! but if it reaches 0%... i will win! :D"
            + "\nThe phone will vibrate everytime you do it incorrectly"
            + "\nDifficulty: " + difficultyTrimmed, "#6599FF", "#ffffff", 10000);
        this.menuManager.setProperty("healthProgress", "maxprogress", "100");
        this.menuManager.setProperty("healthProgress", "progress", this.progress.toString());
        this.startTime = currentTime;
        this.gameStartTime = this.startTime + 10000;
    };
    CatchMiniGame.prototype.onTick = function (currentTime) {
        if (currentTime > this.gameStartTime) {
            this.updateProgress(currentTime);
            this.moveToRandomLocation(currentTime);
            this.drawRandomImage(currentTime);
        }
        else {
            this.lastDecreaseTime = currentTime;
            this.touches = 1;
        }
    };
    CatchMiniGame.prototype.updateProgress = function (currentTime) {
        var ongoingTime = currentTime - this.lastDecreaseTime;
        if (ongoingTime > 1000) {
            this.progress = this.progress - 1 - this.difficulty / 100;
            this.lastDecreaseTime = currentTime;
        }
        if (this.progress <= 0) {
            this.finishCallback(false);
        }
        if (this.progress < 20)
            this.menuManager.setProperty("healthProgress", "frontcolor", "#EC2027");
        else if (this.progress < 60)
            this.menuManager.setProperty("healthProgress", "frontcolor", "#E59400");
        this.menuManager.setProperty("healthProgress", "Progress", this.progress.toString());
    };
    CatchMiniGame.prototype.moveToRandomLocation = function (currentTime) {
        var randomMove = Math.floor(Math.random() * this.difficulty * 60) - Math.floor(Math.random() * this.difficulty * 60);
        this.actionManager.move(randomMove, randomMove, 250);
    };
    CatchMiniGame.prototype.drawRandomImage = function (currentTime) {
        if (currentTime - this.lastDrawTime < 5000)
            return;
        this.lastDrawTime = currentTime;
        var randomImage = this.resourceHelper.chooseRandomImage("laughing");
        if (randomImage != null)
            this.actionManager.draw(randomImage, this.configurationManager.getMaximalResizeRatio(), false);
    };
    CatchMiniGame.prototype.onEventOccured = function (eventName) {
        var now = this.configurationManager.getCurrentTime().currentTimeMillis;
        switch (eventName) {
            case "touch":
                this.handleTouch(now);
                break;
            case "stop":
                if (now - this.gameStartTime > 0)
                    this.finishCallback(false);
                break;
        }
    };
    CatchMiniGame.prototype.handleTouch = function (currentTime) {
        this.touches++;
        this.progress += this.touches;
        if (this.progress <= 0)
            this.finishCallback(false);
        else if (this.progress >= 100)
            this.finishCallback(true);
    };
    return CatchMiniGame;
}(MiniGame));
var HideAndSeekMiniGame = (function (_super) {
    __extends(HideAndSeekMiniGame, _super);
    function HideAndSeekMiniGame(handler, finishCallback) {
        var _this = _super.call(this) || this;
        _this.menuManager = handler.getMenuManager();
        _this.actionManager = handler.getActionManager();
        _this.characterManager = handler.getCharacterManager();
        _this.configurationManager = handler.getConfigurationManager();
        _this.finishCallback = finishCallback;
        return _this;
    }
    HideAndSeekMiniGame.prototype.onStart = function (currentTime) {
        this.catches = 0;
        this.goalCatches = Math.floor(Math.random() * 20) + 1;
        this.gameTime = Math.floor(this.goalCatches * Math.random() * 10) + 5;
        this.actionManager.showMessage("This is a hide and seek game! i will hide, and your job is to catch me "
            + this.goalCatches + " times in "
            + this.gameTime
            + " seconds! :D \nThe phone will vibrate everytime you catch me", "#6599FF", "#ffffff", 10000);
        this.menuManager.setProperty("healthProgress", "maxprogress", this.gameTime.toString());
        this.menuManager.setProperty("healthProgress", "progress", this.gameTime.toString());
        this.startTime = currentTime;
        this.gameStartTime = this.startTime + 10000;
    };
    HideAndSeekMiniGame.prototype.onTick = function (currentTime) {
        if (currentTime > this.gameStartTime) {
            this.actionManager.animateAlpha(0, 50);
            this.updateProgress(currentTime);
            this.moveToRandomLocation(currentTime);
        }
        else {
            this.catches = 0;
        }
        if (currentTime - this.startTime > this.gameTime * 1000) {
            this.finishCallback(false);
        }
    };
    HideAndSeekMiniGame.prototype.updateProgress = function (currentTime) {
        var ongoingTime = currentTime - this.gameStartTime;
        var remainingTime = this.gameTime - ongoingTime / 1000;
        if (remainingTime < 20)
            this.menuManager.setProperty("healthProgress", "frontcolor", "#EC2027");
        else if (remainingTime < 40)
            this.menuManager.setProperty("healthProgress", "frontcolor", "#E59400");
        this.menuManager.setProperty("healthProgress", "Progress", remainingTime.toString());
    };
    HideAndSeekMiniGame.prototype.moveToRandomLocation = function (currentTime) {
        var randomX = Math.floor(Math.random() * this.configurationManager.getScreenWidth());
        var randomY = Math.floor(Math.random() * this.configurationManager.getScreenHeight());
        var currentX = this.characterManager.getCurrentCharacterXPosition();
        var currentY = this.characterManager.getCurrentCharacterYPosition();
        var disX = Math.abs(currentX - randomX);
        var disY = Math.abs(currentY - randomY);
        var moveX = currentX > randomX ? -disX : disX;
        var moveY = currentY > randomY ? -disY : disY;
        this.actionManager.move(moveX, moveY, 20);
    };
    HideAndSeekMiniGame.prototype.onEventOccured = function (eventName) {
        switch (eventName) {
            case "touch":
                this.catches++;
                this.actionManager.showSystemMessage("catches: " + this.catches.toString());
                this.actionManager.vibrate(250);
                if (this.catches >= this.goalCatches) {
                    this.finishCallback(true);
                    return;
                }
                break;
            case "stop":
                if (this.configurationManager.getCurrentTime().currentTimeMillis - this.gameStartTime > 0)
                    this.finishCallback(false);
                break;
        }
    };
    return HideAndSeekMiniGame;
}(MiniGame));
//# sourceMappingURL=Minigame.js.map