document.addEventListener("click", function (e) {
    if (e.target && e.target.id == "replay") {
        console.log("click");
        loopThroughRecordedPaths();
    }
});

const findDomNodeFromXpath = (xPath) => {
    var xPathRes = document.evaluate(
        xPath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    );
    return xPathRes.singleNodeValue;
};

const loopThroughRecordedPaths = () => {
    chrome.storage.sync.get(["recordedPaths"], function (result) {
        console.log("recordedPaths[i]", result.recordedPaths[i]);
        for (var i = 0; i < result.recordedPaths.length; i++) {
            (function (i) {
                setTimeout(function () {
                    findDomNodeFromXpath(result.recordedPaths[i].xPath).click();
                }, 5000 * i);
            })(i);
        }
    });
};
