document.addEventListener("click", function (e) {
    if (e.target && e.target.id == "replay") {
        console.log("click");
        loopThroughSplittedText();
    }
});

function loopThroughSplittedText() {
    for (var i = 0; i < recordedPaths.length; i++) {
        // for each iteration console.log a word
        // and make a pause after it
        (function (i) {
            setTimeout(function () {
                console.log("recordedPaths[i].target", recordedPaths[i].target);
                recordedPaths[i].target.click();
                console.log(recordedPaths[i]);
            }, 5000 * i);
        })(i);
    }
}
