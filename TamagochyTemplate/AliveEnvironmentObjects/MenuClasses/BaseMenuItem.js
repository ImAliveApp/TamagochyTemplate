var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BaseMenuItem = (function () {
    function BaseMenuItem() {
    }
    return BaseMenuItem;
}());
var PaintMenuItem = (function (_super) {
    __extends(PaintMenuItem, _super);
    function PaintMenuItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PaintMenuItem;
}(BaseMenuItem));
var PictureMenuItem = (function (_super) {
    __extends(PictureMenuItem, _super);
    function PictureMenuItem() {
        var _this = _super.call(this) || this;
        _this.ViewType = ViewType.Picture;
        return _this;
    }
    return PictureMenuItem;
}(BaseMenuItem));
PictureMenuItem.UseProfilePicture = "Use Profile Picture";
PictureMenuItem.UseCoverPicture = "Use Cover Picture";
var ButtonMenuItem = (function (_super) {
    __extends(ButtonMenuItem, _super);
    function ButtonMenuItem() {
        var _this = _super.call(this) || this;
        _this.ViewType = ViewType.Button;
        return _this;
    }
    return ButtonMenuItem;
}(PaintMenuItem));
var CheckBoxMenuItem = (function (_super) {
    __extends(CheckBoxMenuItem, _super);
    function CheckBoxMenuItem() {
        var _this = _super.call(this) || this;
        _this.ViewType = ViewType.CheckBox;
        return _this;
    }
    return CheckBoxMenuItem;
}(PaintMenuItem));
var TextBoxMenuItem = (function (_super) {
    __extends(TextBoxMenuItem, _super);
    function TextBoxMenuItem() {
        var _this = _super.call(this) || this;
        _this.ViewType = ViewType.TextBox;
        return _this;
    }
    return TextBoxMenuItem;
}(PaintMenuItem));
var ProgressBarMenuItem = (function (_super) {
    __extends(ProgressBarMenuItem, _super);
    function ProgressBarMenuItem() {
        var _this = _super.call(this) || this;
        _this.ViewType = ViewType.ProgressBar;
        return _this;
    }
    return ProgressBarMenuItem;
}(PaintMenuItem));
//# sourceMappingURL=BaseMenuItem.js.map