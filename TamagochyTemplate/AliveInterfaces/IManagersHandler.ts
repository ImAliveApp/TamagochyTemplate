interface IManagersHandler {
    getActionManager(): IActionManager;
    getCharacterManager(): ICharacterManager;
    getConfigurationManager(): IConfigurationManager;
    getDatabaseManager(): IDatabaseManager;
    getMenuManager(): IMenuManager;
    getResourceManager(): IResourceManager;
    getRestManager(): IRestManager;
    getAwarenessManager(): IAwarenessManager;
    getSpeechToTextManager(): ISpeechToTextManager;
    getTextToSpeechManager(): ITextToSpeechManager;
    getCalendarManager(): ICalendarManager;
    getInformationManager(): IInformationManager;
}