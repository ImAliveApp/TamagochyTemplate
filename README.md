## Tamagochy Template:

### Main concept:
This sample is of a character that act as a tamagochy, the code responds to actions that occures on the phone and in addition it displays the 
[character menu](https://github.com/hay12396/ImAliveGuide/wiki/The-Character-Menu) to allow the user to interact with the character.
Once an event occure (such as the user plugged the phone to a power supply) the character will activate the proper image and sound resource
that you have set.

### Current actions:
The Tamagochy template have the following actions available in its Character Menu:
1. eating: clicking the 'Eat' button will activate image and sound resources from the 'eating' category.
2. drinking: clicking the 'Drink' button will activate image and sound resources from the 'drinking' category.
3. laughing: clicking the 'Tickle me!' button will activate image and sound resources from the 'drinking' category.

### How to use:
In order to use this template, do the following steps:

1. Download and build it this project (following [this](https://github.com/hay12396/ImAliveGuide/wiki/How-to:-Build-and-upload-a-character-code) guide)

2. Upload resources to the actions that you wish to register (i.e upload image and sound resources to the POWER_CONNECTED category to attach them to this event)

3. Publish your character and see the results! (following [this](https://github.com/hay12396/ImAliveGuide/wiki/How-to:-Publish-your-character) guide)

### The code:
Most of the action responds work is done in the "onActionReceived" method:
```javascript
    onPhoneEventOccurred(eventName: string, jsonedData: string): void {
        this.actionManager.showMessage(actionName + " received");
        this.drawAndPlayRandomResourceByCategory(actionName);
    }
```
And the character menu work is done in the "onMenuItemSelected" method:
```javascript
    onMenuItemSelected(viewName: string): void {
        if (viewName == "feedButton" || viewName == "drinkButton") {
            this.Hp = this.Hp + 10;
            if (this.Hp > 100)
                this.Hp = 100;

            this.lastEatingTime = this.configurationMananger.getCurrentTime().currentTimeMillis;
            if (viewName == "feedButton") {
                this.drawAndPlayRandomResourceByCategory("eating");
            }
            else {
                this.drawAndPlayRandomResourceByCategory("drinking");
            }

            this.databaseManager.saveObject("health", this.Hp.toString());
            this.menuManager.setProperty("healthProgress", "progress", this.Hp.toString());
        }
        else if (viewName == "tickleButton") {
            this.drawAndPlayRandomResourceByCategory("laughing");
        }
    }
```

Once an action occures, this method gets called with the actionName being the name of the action that occured, i.e in case
of the device being plugged to a power supply, this method will be called with the actionName being "POWER_CONNECTED".

If you have upload resources to the website under the "POWER_CONNECTED" category, a random image and a random sound will be picked and used
by the "drawAndPlayRandomResourceByCategory" method.

**Note**: you must [register](http://linkToActionRegisterGuide.com) to a phone action in order to be notified when it occures.
