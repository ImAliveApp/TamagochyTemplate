interface ICharacterManager {

   /**
    * This method will return the X position of the image resource on the screen.
    */
    getCurrentCharacterXPosition(): number;

   /**
    * This method will return the Y position of the image resource on the screen.
    */
    getCurrentCharacterYPosition(): number;

   /**
    * This method will return true if the character is being dragged by the user.
    */
    isCharacterBeingDragged(): boolean;

   /**
    * This method will return the rotation value of the image resource on the screen (0 if the actionManager.rotateImage was never called).
    */
    getCurrentDrawingRotation(): number;

   /**
    * This method will return the bounding box of the image resource on the screen.
    */
    getBoundingBox(): IRectangle;
};
