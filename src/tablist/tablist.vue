<template>
    <div id="tablist">
        <win-header :selected="selected" @closeWindow="closeWindow"/>
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div v-for="win in windows" class="swiper-slide" @mousewheel="wheel($event)"  @scroll="scroll">
                    <tablist-page :tabs="win.tabs" :thumbs="thumbs" :port="port" @click="tabclick"
                                  @mouseenter="mouseenter" @close="close"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import EventEmitter from 'eventemitter3'
    import TablistPage from './components/tablistpage.vue'
    import ChromePromise from "chrome-promise"
    import WinHeader from "./components/win-header.vue"
    import eventHub from "./tablist.js"

    let tabdata = {windows: [], thumbs: [], selected: {}, focused: NaN, port: null};
    let EE = new EventEmitter();
    let closeTimer = null;
    let closingTabs = [];
    let wheelValue = 0;
    let pageChangedTimer;
    let wheelTimer;
    const chromep = new ChromePromise();


    function closeAruTab() {
        tabdata.port.postMessage({"message": "closeAruTab"});
    }


    let App = {
            name: "tablist",
            data: function () {
                return tabdata;
            },
            components: {"tablist-page": TablistPage, "win-header": WinHeader},
            methods: {
                tabclick: function (tab) {
                    changeTab(tab.id, tab.windowId);
                },
                mouseenter: function (tab) {
                    tabdata.selected = tab
                },
                close: function (tab) {
                    eventHub.$emit("tab-close", tab);
                },
                closeWindow: function () {
                    closeAruTab();
                },
                scroll : function(){
                    pageChangedTimer = setTimeout( () => {pageChangedTimer = null},300);
                },
                wheel: function (e) {
                    const active = $(".swiper-slide-active")[0];
                    if(pageChangedTimer){   // no wheel when page changed
                        e.preventDefault();
                        return;
                    }

                    if (  (active.scrollTop < 10 && e.deltaY < 0 )
                        || (active.scrollHeight - 10 < active.offsetHeight + active.scrollTop && e.deltaY > 0)) {
                        e.preventDefault();
                        wheelValue += e.deltaY;
                        if (wheelTimer) clearTimeout(wheelTimer);
                        wheelTimer = setTimeout(() => {
                            wheelValue = 0
                        }, 200);
                        const swiper = $(".swiper-container")[0].swiper;

                        if (wheelValue > 1000) { //next
                            if(swiper.isEnd)
                                swiper.slideTo(0);
                            else
                                swiper.slideNext();

                            wheelValue = -wheelValue*2;
                            pageChangedTimer = setTimeout( () => {pageChangedTimer = null},300);
                        } else if (wheelValue < -1000) {
                            if(swiper.isBeginning)
                                swiper.slideTo(swiper.slides.length - 1);
                            else
                                swiper.slidePrev();
                            wheelValue = -wheelValue*2;
                            pageChangedTimer = setTimeout( () => {pageChangedTimer = null},300);
                        }
                    }

                }

            },
            updated: function () {
                if (isNaN(tabdata.focused)) return;
                const slider = $(".swiper-container");
                if (slider[0].swiper) {
                    slider[0].swiper.update();
                    if (tabdata.windows.length === 1)
                        slider[0].swiper.lockSwipes();
                    else
                        slider[0].swiper.unlockSwipes();
                } else {
                    slider.swiper({
                        /*mousewheelControl: true,    // Optional parameters
                         loop: true,
                         mousewheelForceToAxis: true,*/
                        direction: "vertical",
                        initialSlide: tabdata.focused,

                        // If we need pagination
                        pagination: '.swiper-pagination',
                        paginationClickable: true,

                        // Navigation arrows
                        nextButton: '.swiper-button-next',
                        prevButton: '.swiper-button-prev',

                        simulateTouch : false,  // no mouse touch
                        shortSwipes : false,
                        longSwipesRatio : 0.2,
                        longSwipesMs : 100,


                    });
                    const sw = slider[0].swiper;
                    const original = sw.slideTo;
                    sw.slideTo = function(p){  console.log(p);
                    original(( sw.slides.length + p) %  sw.slides.length) };
                    if (tabdata.windows.length == 1)
                        sw.lockSwipes();
                    else
                        sw.unlockSwipes();
                }
            }
        }
    ;
    export default App;


    function getWindows() {
        return new Promise(res => {
            tabdata.port.postMessage({"message": "getWindows"});
            EE.once("getWindows", res);
        });
    }

    function initConnection() {
        tabdata.port = chrome.runtime.connect(null, {});
        tabdata.port.onMessage.addListener((arg) => {
            switch (arg.message) {
                case "getWindows":
                    EE.emit("getWindows", arg.wins);
                    break;
            }

        });
    }

    function initWindows() {
        getWindows().then(wins => {
            tabdata.windows = wins;

            let def = [];
            //for (const w of wins){
            wins.forEach((w, index) => {
                if (w.focused) tabdata.focused = index;
                for (const t of w.tabs) def.push("" + t.id);
            });

            chromep.storage.local.get(def).then(items => {
                tabdata.thumbs = items;
            });
        });
    }

    initConnection();
    initWindows();

</script>

<style>
    body {
        background: #333;
        margin: 0;
        overflow: hidden;
    }
    .swiper-container{
        height:calc(100vh - 55px);
    }
    .tablist-invisible {
        display: none;
    }

    .swiper-slide-active {
        height: calc(100vh - 55px) !important;
        overflow: scroll;
    }
    .swiper-slide:not(.swiper-slide-active)
    {
        visibility: hidden;
    }
    .swiper-container-vertical>.swiper-wrapper{
        transition:none!important;;
    }
</style>