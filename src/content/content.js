function openAruTab()
{
    jQuery("<iframe>").attr("id", "arutab-insert-iframe").addClass("arutab-iframe-visible")
        .attr("src", chrome.runtime.getURL("tablist/tablist.html"))
        .appendTo("body");
        //setTimeout(() => jQuery("#arutab-insert-iframe").remove(), 10000); 
}
    
function closeAruTab() {
    jQuery("#arutab-insert-iframe").remove();
}

chrome.runtime.onMessage.addListener( msg => {
    if (msg.message == "closeAruTab") closeAruTab();
});

$( function(){
    $(document).on("keydown",e => {
        if(e.ctrlKey && e.keyCode == 81)
        {
            openAruTab();
        }
    })
});