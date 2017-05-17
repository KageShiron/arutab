function openAruTab() {
    if ($("#arutab-insert-container").length == 0) {
        jQuery("<div id='arutab-insert-container'/>").append(
            jQuery("<iframe>").attr("id", "arutab-insert-iframe")
                .attr("src", chrome.runtime.getURL("tablist/tablist.html"))
                .on("load", function () {
                    $("#arutab-insert-container").addClass("arutab-container-visible")
                })
        ).on("click", frameMarginClick).appendTo("body");
        //setTimeout(() => jQuery("#arutab-insert-iframe").remove(), 10000); 
        return true;
    } else {
        return false;
    }
}

function toggleAruTab() {
    if (!openAruTab()) closeAruTab();
}

function frameMarginClick(e) {
    if (e.target.id === "arutab-insert-container") {
        closeAruTab();
    }
}

function closeAruTab() {
    jQuery("#arutab-insert-container").remove();
}

chrome.runtime.onMessage.addListener(msg => {
    if (msg.message == "closeAruTab") closeAruTab();
});

$(function () {
    $(document).on("keydown", e => {
        if (e.ctrlKey && e.keyCode == 81) {
            toggleAruTab();
        }
    })
});
keyStatus = {};


/*
 $(document).on("keydown", (e) => {
 if (e.keyCode == 27 && jQuery("#arutab-insert-iframe").length != 0) {
 closeAruTab();
 }
 console.log(`down/${keyStatus.isTouchPad}/${e.ctrlKey}/${keyStatus.isShortCtrlKey}/${keyStatus.ctrlKey}`);
 if (e.keyCode == 17 && !keyStatus.ctrlKey) {
 keyStatus.ctrlKey = true;
 keyStatus.isShortCtrlKey = true;
 setTimeout(() => {
 keyStatus.isShortCtrlKey = false
 console.log("shortTime");
 }, 50);
 }
 });
 document.addEventListener("keyup", (e) => {
 console.log(`up/${keyStatus.isTouchPad}/${e.ctrlKey}/${keyStatus.isShortCtrlKey}/${keyStatus.ctrlKey}`);
 if (e.keyCode == 17) {
 keyStatus.ctrlKey = false;
 keyStatus.isShortCtrlKey = false;
 keyStatus.isTouchPad = false;
 }
 }
 );
 window.addEventListener("mousewheel", (e) => {
 console.log(`wheel/${keyStatus.isTouchPad}/${e.ctrlKey}/${keyStatus.isShortCtrlKey}/${keyStatus.ctrlKey}`);

 if (keyStatus.isTouchPad) { e.preventDefault(); return; }
 if (!e.ctrlKey) return;

 if (keyStatus.ctrlKey && !keyStatus.isShortCtrlKey) {
 return;
 } else {
 console.log("prevent");
 e.preventDefault();
 keyStatus.isTouchPad = true;
 if (jQuery("#arutab-insert-iframe").length != 0) return;
 setTimeout(openAruTab, 0);
 }
 ;
 return;

 });
 */