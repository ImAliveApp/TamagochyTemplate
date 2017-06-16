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

    static get FUNNY_CATEGORY(): string { return "FUNNY" }
    static get SCARY_CATEGORY(): string { return "SCARY" }
    static get GENERAL_CATEGORY(): string { return "GENERAL" }
    static get MINI_GAMES_CATEGORY(): string { return "MINI GAMES" }
    static get REAL_PEOPLE_CATEGORY(): string { return "REAL PEOPLE" }
    static get ADULT_CATEGORY(): string { return "ADULT" }
    static get CARTOON_CATEGORY(): string { return "CARTOON" }

    static get USER_EVENT_CHARACTER_UP_VOTE(): string { return "USER_EVENT_CHARACTER_UP_VOTE" }
    static get USER_EVENT_CHARACTER_DOWN_VOTE(): string { return "USER_EVENT_CHARACTER_DOWN_VOTE" }
    static get USER_EVENT_CHARACTER_DOWNLOAD_STARTED(): string { return "USER_EVENT_CHARACTER_DOWNLOAD_STARTED" }
    static get USER_EVENT_CHARACTER_DOWNLOAD_CANCELED(): string { return "USER_EVENT_CHARACTER_DOWNLOAD_CANCELED" }
    static get USER_EVENT_CHARACTER_DOWNLOAD_FINISHED(): string { return "USER_EVENT_CHARACTER_DOWNLOAD_FINISHED" }
    static get USER_EVENT_CHARACTER_DELETED(): string { return "USER_EVENT_CHARACTER_DELETED" }
    static get USER_EVENT_USER_CHANGE_PICTURE(): string { return "USER_EVENT_USER_CHANGE_PICTURE" }
    static get USER_EVENT_USER_COMMENT(): string { return "USER_EVENT_USER_COMMENT" }

    static get IConfigurationManager(): string { return "IConfigurationManager" };
    static get IActionManager(): string { return "IActionManager" };
    static get ICharacterManager(): string { return "ICharacterManager" };
    static get IDatabaseManager(): string { return "IDatabaseManager" };
    static get IResourceManager(): string { return "IResourceManager" };
    static get IMenuManager(): string { return "IMenuManager" };
    static get IAwarenessManager(): string { return "IAwarenessManager" }

};
