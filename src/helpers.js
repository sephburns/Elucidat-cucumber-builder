const myAudio = new Audio(chrome.runtime.getURL("../audio/beep.mp3"));

const playConfirmationSound = () => {
    myAudio.play();
};

const isAllowedTag = (queryTag) => {
    const allowedTags = tagTypes.map((tag) => {
        return tag.tagName;
    });
    return allowedTags.indexOf(queryTag) !== -1;
};

function Path(eventType, target, xPath, value, tagName) {
    this.eventType = eventType;
    this.target = target;
    this.xPath = xPath;
    this.value = value;
    this.tagName = tagName;
}

const getPathTo = (element) => {
    if (element.id !== "") return `//*[@id="${element.id}"]`;
    if (element === document.body) return "//body";

    var ix = 0;
    var siblings = element.parentNode.childNodes;
    for (var i = 0; i < siblings.length; i++) {
        var sibling = siblings[i];
        if (sibling === element)
            return (
                getPathTo(element.parentNode) +
                "/" +
                element.tagName +
                "[" +
                (ix + 1) +
                "]"
            );
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++;
    }
};

const getTagName = (event) => {
    return event.path[0].tagName.toLowerCase();
};

const debounce = (func, wait, immediate) => {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};
