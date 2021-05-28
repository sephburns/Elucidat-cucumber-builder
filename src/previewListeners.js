const uiElementIds = [
    "replay",
    "clearLocalPaths",
    "cucumber-preview-box",
    "cucumber-preview-holder",
];

const isUiElement = (element) => {
    return uiElementIds.indexOf(element) !== -1;
};

document.addEventListener("click", (event) => {
    if (event.target && event.target.id == "clearLocalPaths") {
        clearLocalPaths();
    }
    if (event.target && event.target.id === "replay") {
        handleReplay();
    }
    if (event.target && event.target.id === "commit") {
        handleCommit();
    }
});

document.addEventListener("mouseover", (event) => {
    if (!isUiElement(event.target.id)) {
        handleMouseOver(event);
    }
});

document.addEventListener("mousedown", (event) => {
    if (!isUiElement(event.target.id)) {
        handleMouseDown(event);
    }
});

document.addEventListener("keypress", (event) => {
    handleKeyPress(event);
});
