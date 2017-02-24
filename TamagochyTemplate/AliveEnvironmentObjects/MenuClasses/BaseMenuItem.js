var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BaseMenuItem = (function () {
    function BaseMenuItem() {
    }
    return BaseMenuItem;
}());
var PaintMenuItem = (function (_super) {
    __extends(PaintMenuItem, _super);
    function PaintMenuItem() {
        _super.apply(this, arguments);
    }
    return PaintMenuItem;
}(BaseMenuItem));
var PictureMenuItem = (function (_super) {
    __extends(PictureMenuItem, _super);
    function PictureMenuItem() {
        _super.call(this);
        this.ViewType = ViewType.Picture;
    }
    PictureMenuItem.UseProfilePicture = "Use Profile Picture";
    PictureMenuItem.UseCoverPicture = "Use Cover Picture";
    return PictureMenuItem;
}(BaseMenuItem));
var ButtonMenuItem = (function (_super) {
    __extends(ButtonMenuItem, _super);
    function ButtonMenuItem() {
        _super.call(this);
        this.ViewType = ViewType.Button;
    }
    return ButtonMenuItem;
}(PaintMenuItem));
var CheckBoxMenuItem = (function (_super) {
    __extends(CheckBoxMenuItem, _super);
    function CheckBoxMenuItem() {
        _super.call(this);
        this.ViewType = ViewType.CheckBox;
    }
    return CheckBoxMenuItem;
}(PaintMenuItem));
var TextBoxMenuItem = (function (_super) {
    __extends(TextBoxMenuItem, _super);
    function TextBoxMenuItem() {
        _super.call(this);
        this.ViewType = ViewType.TextBox;
    }
    return TextBoxMenuItem;
}(PaintMenuItem));
var ProgressBarMenuItem = (function (_super) {
    __extends(ProgressBarMenuItem, _super);
    function ProgressBarMenuItem() {
        _super.call(this);
        this.ViewType = ViewType.ProgressBar;
    }
    return ProgressBarMenuItem;
}(PaintMenuItem));
//# sourceMappingURL=BaseMenuItem.js.map