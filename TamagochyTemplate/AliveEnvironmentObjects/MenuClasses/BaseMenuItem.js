var BaseMenuItem = (function () {
    function BaseMenuItem() {
    }
    return BaseMenuItem;
}());
var PaintMenuItem = (function () {
    function PaintMenuItem() {
    }
    return PaintMenuItem;
}());
var PictureMenuItem = (function () {
    function PictureMenuItem() {
        this.ViewType = ViewType.Picture;
    }
    return PictureMenuItem;
}());
PictureMenuItem.UseProfilePicture = "Use Profile Picture";
PictureMenuItem.UseCoverPicture = "Use Cover Picture";
var ButtonMenuItem = (function () {
    function ButtonMenuItem() {
        this.ViewType = ViewType.Button;
    }
    return ButtonMenuItem;
}());
var CheckBoxMenuItem = (function () {
    function CheckBoxMenuItem() {
        this.ViewType = ViewType.CheckBox;
    }
    return CheckBoxMenuItem;
}());
var SwitchMenuItem = (function () {
    function SwitchMenuItem() {
        this.ViewType = ViewType.Switch;
    }
    return SwitchMenuItem;
}());
var TextBoxMenuItem = (function () {
    function TextBoxMenuItem() {
        this.ViewType = ViewType.TextBox;
    }
    return TextBoxMenuItem;
}());
var HyperLinkMenuItem = (function () {
    function HyperLinkMenuItem() {
        this.ViewType = ViewType.HyperLink;
    }
    return HyperLinkMenuItem;
}());
var ProgressBarMenuItem = (function () {
    function ProgressBarMenuItem() {
        this.ViewType = ViewType.ProgressBar;
    }
    return ProgressBarMenuItem;
}());
//# sourceMappingURL=BaseMenuItem.js.map