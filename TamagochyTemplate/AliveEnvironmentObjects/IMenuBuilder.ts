interface IMenuBuilder {
    createTextBox(textBox: ITextBoxMenuItem): void;
    createButton(button: IButtonMenuItem): void;
    createPicture(picture: IPictureMenuItem): void;
    createProgressBar(progressBar: IProgressBarMenuItem): void;
    createCheckBox(checkBox: ICheckBoxMenuItem): void;
    createMenuHeader(menuHeader: IMenuHeader): void;
    getMaxColumns(): number;
    getMaxRows(): number;
}