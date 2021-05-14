const recordedPaths = [];
const recordedTarget = [];

function getPathTo(element) {
    if (element.id !== "") return 'id("' + element.id + '")';
    if (element === document.body) return element.tagName;

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
}

document.addEventListener("mousedown", function (event) {
    chrome.storage.sync.get(["recording"], function (result) {
        const isRecording = result.recording;
        if (isRecording) {
            recordedPaths.push({
                eventType: "clicked",
                target: event.target,
                xPath: getPathTo(event.target),
                value: "",
            });
            console.log("recordedPaths", recordedPaths);
        }
        var searchTimeout;
        event.target.addEventListener("keypress", (event) => {
            if (searchTimeout != undefined) clearTimeout(searchTimeout);
            searchTimeout = setTimeout(callServerScript, 2000);
            function callServerScript() {
                recordedPaths.push({
                    eventType: "entered_text",
                    target: event.target,
                    xPath: getPathTo(event.target),
                    value: event.target.value,
                });
                console.log("recordedPaths", recordedPaths);
            }
        });
    });
});
