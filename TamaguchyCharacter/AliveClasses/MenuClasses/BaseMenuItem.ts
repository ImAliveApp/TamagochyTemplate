class BaseMenuItem {
    public Name: string;
    public InitialX: number;
    public InitialY: number;
    public Width: number;
    public Height: number;
    protected ViewType: number;//no need to change.
}

class PaintMenuItem extends BaseMenuItem {
    public TextColor: string;
    public BackgroundColor: string;
}

class PictureMenuItem extends BaseMenuItem {
    constructor() {
        super();
        this.ViewType = ViewType.Picture;
    }
    static UseProfilePicture = "Use Profile Picture";
    static UseCoverPicture = "Use Cover Picture";
    PictureResourceName: string;
}

class ButtonMenuItem extends PaintMenuItem {
    constructor() {
        super();
        this.ViewType = ViewType.Button;
    }
    public Text: string;
}

class CheckBoxMenuItem extends PaintMenuItem {
    constructor() {
        super();
        this.ViewType = ViewType.CheckBox;
    }
    public Checked: boolean;
    public Text: string;
    public UncheckedText: string;
    public FrontColor: string;
}

class TextBoxMenuItem extends PaintMenuItem {
    constructor() {
        super();
        this.ViewType = ViewType.TextBox;
    }
    public Text: string;
}

class ProgressBarMenuItem extends PaintMenuItem {
    constructor() {
        super();
        this.ViewType = ViewType.ProgressBar;
    }
    public MaxProgress: number;
    public FrontColor: string;
    public Progress: number;
}