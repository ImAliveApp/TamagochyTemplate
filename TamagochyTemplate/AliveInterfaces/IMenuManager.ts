interface IMenuManager {

    /**
     * This method will change the property value of a view that is associated with that viewName.
     * @param viewName The name of the view that we wish to change.
     * @param property The property name that we wish to change.
     * @param value The new value that we wish to set.
     */
    setProperty(viewName: string, property: string, value: string): void;

    /**
     * This method will open the character menu.
     */
    openMenu(): void;
};
