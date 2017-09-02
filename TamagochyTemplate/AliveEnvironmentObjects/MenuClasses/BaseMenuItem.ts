class BaseMenuItem implements IBaseMenuItem {
    public Name: string;
    public InitialX: number;
    public InitialY: number;
    public Width: number;
    public Height: number;
}

class PaintMenuItem implements IPaintMenuItem {
    public Name: string;
    public InitialX: number;
    public InitialY: number;
    public Width: number;
    public Height: number;
    public TextColor: string;
    public BackgroundColor: string;
}

class PictureMenuItem implements IPictureMenuItem {
    constructor() {
        this.ViewType = ViewType.Picture;
    }
    static UseProfilePicture = "Use Profile Picture";
    static UseCoverPicture = "Use Cover Picture";
    protected ViewType: number;//no need to change.
    public Name: string;
    public InitialX: number;
    public InitialY: number;
    public Width: number;
    public Height: number;
    public PictureResourceName: string;
}

class ButtonMenuItem implements IButtonMenuItem {
    constructor() {
        this.ViewType = ViewType.Button;
    }
    protected ViewType: number;//no need to change.
    public Name: string;
    public InitialX: number;
    public InitialY: number;
    public Width: number;
    public Height: number;
    public Text: string;
    public TextColor: string;
    public BackgroundColor: string;
}

class CheckBoxMenuItem implements ICheckBoxMenuItem {
    constructor() {
        this.ViewType = ViewType.CheckBox;
    }
    protected ViewType: number;//no need to change.
    public Name: string;
    public InitialX: number;
    public InitialY: number;
    public Width: number;
    public Height: number;
    public Checked: boolean;
    public Text: string;
    public UncheckedText: string;
    public FrontColor: string;
    public TextColor: string;
    public BackgroundColor: string;
}

class SwitchMenuItem implements ISwitchMenuItem {
    constructor() {
        this.ViewType = ViewType.Switch;
    }
    protected ViewType: number;//no need to change.
    public Name: string;
    public InitialX: number;
    public InitialY: number;
    public Width: number;
    public Height: number;
    public Checked: boolean;
    public Text: string;
    public UncheckedText: string;
    public FrontColor: string;
    public TextColor: string;
    public BackgroundColor: string;
}

class TextBoxMenuItem implements ITextBoxMenuItem {
    constructor() {
        this.ViewType = ViewType.TextBox;
    }
    protected ViewType: number;//no need to change.
    public Name: string;
    public InitialX: number;
    public InitialY: number;
    public Width: number;
    public Height: number;
    public TextColor: string;
    public BackgroundColor: string;
    public Text: string;
}

class HyperLinkMenuItem implements IHyperLinkMenuItem {
    constructor() {
        this.ViewType = ViewType.HyperLink;
    }
    protected ViewType: number;//no need to change.
    public Name: string;
    public InitialX: number;
    public InitialY: number;
    public Width: number;
    public Height: number;
    public TextColor: string;
    public BackgroundColor: string;
    public Text: string;
    public Link: string;
}

class ProgressBarMenuItem implements IProgressBarMenuItem {
    constructor() {
        this.ViewType = ViewType.ProgressBar;
    }
    protected ViewType: number;//no need to change.
    public Name: string;
    public InitialX: number;
    public InitialY: number;
    public Width: number;
    public Height: number;
    public TextColor: string;
    public BackgroundColor: string;
    public MaxProgress: number;
    public FrontColor: string;
    public Progress: number;
}