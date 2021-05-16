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

const handleReplay = () => {
    chrome.storage.sync.get(["recordedPaths"], function (result) {
        isReplaying = true;
        loopThroughRecordedPaths(result.recordedPaths);
    });
};

function loopThroughRecordedPaths(paths) {
    for (var i = 0; i < paths.length; i++) {
        (function (i) {
            setTimeout(function () {
                findDomNodeFromXpath(paths[i].xPath).click();
            }, 1000 * i);
        })(i);
    }
}
