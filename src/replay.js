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
        // If we're at the start of replay turn isReplaying to true so we don't accidentally capture more paths
        isReplaying = true;
        loopThroughRecordedPaths(result.recordedPaths);
    });
};

function loopThroughRecordedPaths(paths) {
    for (var i = 0; i < paths.length; i++) {
        (function (i) {
            setTimeout(function () {
                findDomNodeFromXpath(paths[i].xPath).click();
                // If we're at the end of replay turn isReplaying to false so we can capture more paths
                if (i + 1 === paths.length) {
                    isReplaying = false;
                }
            }, 5000 * i);
        })(i);
    }
}
