interface IActionManager {

    /**
     * This method will show a bubble message above the character.
     * @param message The message to display.
     * @param hexTextColor The color of the text (in a hexadecimal format).
     * @param hexBackgroundColor The color of the bubble (in a hexadecimal format).
     * @param duration The duration of how long the bubble message will be displayed (in milliseconds).
     */
    showMessage(message: string, hexTextColor: string, hexBackgroundColor: string, duration: number): void;

    /**
     * This method will show a system toast message.
     * @param message The message to display.
     */
    showSystemMessage(message: string);

    /**
     * This method will play a sound.
     * @param resourceName The name of the sound to play.
     * @param loop True if you wish to play this sound in a loop (untill you play other sound or use the stopSound method).
     */
    playSound(resourceName: string, loop: boolean): void;

    /**
     * This method will stop the sound in the backgound.
     */
    stopSound(): void;

    /**
     * This method will move your character on the screen.
     * @param xBy How much to move the character on the X axis.
     * @param yBy How much to move the character on the Y axis.
     * @param duration How long should the movement animation take? (in milliseconds).
     */
    move(xBy: number, yBy: number, duration: number): void;

    /**
     * This method will change the Alpha value of your character.
     * @param toAlpha The target alpha.
     * @param duration How long should the alpha animation take? (in milliseconds).
     */
    animateAlpha(toAlpha: number, duration: number): void;

    /**
     * This method will draw an image resource to the screen.
     * @param resourceName The name of the image resource to draw (INCLUDE the file extension!).
     * @param resizeRatio The ratio that the system will use to resize the image resource. (put 1.0 for no resize).
     * @param mirrored Should we vertically mirror the image? (mirror around the Y axis).
     */
    draw(resourceName: string, resizeRatio: number, mirrored: boolean): void;

    /**
     * This method will make the phone vibrate.
     * @param duration How long should the phone vibrate? (in milliseconds).
     */
    vibrate(milliseconds: number): void;

    /**
     * This method will rotate the image resource on the screen.
     * @param degree The degree to rotate the image to.
     * @param duration How long should the rotation animation take? (in milliseconds).
     */
    rotateImage(degree: number, duration: number): void;

    /**
     * This method will reset the drawing state of the image resource on the screen (mirror=false, rotation=0).
     */
    resetDrawingState(): void;

    /**
     * This method will cancel the current session of the character.
     */
    terminate(): void;
};