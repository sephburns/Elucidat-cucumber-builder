const uiElementIds = ["cucumber-preview-holder"];

const pushUiElementIds = () => {
    var everyChild = document.querySelectorAll("#cucumber-preview-holder *");
    for (var i = 0; i < everyChild.length; i++) {
        if (everyChild[i].id) {
            uiElementIds.push(everyChild[i].id);
        }
    }
};

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
