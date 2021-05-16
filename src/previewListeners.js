const uiElementIds = [
    "replay",
    "clearLocalPaths",
    "cucumber-preview-box",
    "cucumber-preview-holder",
];

const isUiElement = (element) => {
    return uiElementIds.indexOf(element) !== -1;
};

document.addEventListener("click", function (e) {
    if (e.target && e.target.id == "clearLocalPaths") {
        clearLocalPaths();
    }
});

document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "replay") {
        handleReplay();
    }
});

document.addEventListener("mouseover", function (event) {
    if (!isUiElement(event.target.id)) {
        handleMouseOver(event);
    }
});

document.addEventListener("mousedown", function (event) {
    if (!isUiElement(event.target.id)) {
        handleMouseDown(event);
    }
});

document.addEventListener("keypress", function (event) {
    handleKeyPress(event);
});
