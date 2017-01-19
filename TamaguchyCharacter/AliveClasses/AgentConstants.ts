class AgentConstants {
    static get ON_PICK(): string { return "ON_PICK" }
    static get ON_RELEASE(): string { return "ON_RELEASE" }
    static get ON_MOVE(): string { return "ON_MOVE" }
    static get CHARACTER_ACTIVATION(): string { return "CHARACTER_ACTIVATION" }
    static get CHARACTER_DEACTIVATION(): string { return "CHARACTER_DEACTIVATION" }
    static get ON_MOVE_RIGHT(): string { return "ON_MOVE_RIGHT" }
    static get ON_MOVE_LEFT(): string { return "ON_MOVE_LEFT" }
    static get ON_MOVE_UP(): string { return "ON_MOVE_UP" }
    static get ON_MOVE_DOWN(): string { return "ON_MOVE_DOWN" }
    static get ON_FALLING_LEFT(): string { return "ON_FALLING_LEFT" }
    static get ON_FALLING_RIGHT(): string { return "ON_FALLING_RIGHT" }
    static get SMS_RECEIVED(): string { return "SMS_RECEIVED" }
    static get INCOMING_CALL(): string { return "INCOMING_CALL" }
    static get NEW_OUTGOING_CALL(): string { return "NEW_OUTGOING_CALL" }
    static get MENU_ACTION_FEED_ME(): string { return "Feed me." }
    static get MENU_ACTION_CURE_ME(): string { return "Cure me." }
    static get MENU_ACTION_REVIVE_ME(): string { return "Revive me." }
    static get ORIENTATION_PORTRAIT(): number { return 1 }
    static get ORIENTATION_LANDSCAPE(): number { return 2 }


    static get IConfigurationManager(): string{ return "IConfigurationManager" };
    static get IActionManager(): string { return "IActionManager" };
    static get ICharacterManager(): string { return "ICharacterManager" };
    static get IDatabaseManager(): string { return "IDatabaseManager" };
    static get IResourceManager(): string { return "IResourceManager" };
    static get IMenuManager(): string { return "IMenuManager" };
    static get IAwarenessManager(): string { return "IAwarenessManager"}
    
};
