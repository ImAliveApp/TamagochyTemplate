interface IActionManager {
    showMessage(message: string): void;
    playSound(resourceName: string): void;
    stopSound(): void;
    move(x: number, y: number, duration: number): void;
    animateAlpha(toAlpha: number, duration: number): void;
    draw(resourceName: string, resizeRatio: number, mirrored: boolean): void;
    vibrate(milliseconds: number): void;
    rotateImage(degree: number, duration: number): void;
    resetDrawingState(): void;
    terminate(): void;
};