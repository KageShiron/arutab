<template>
  <div id="tablist">
    <win-header :selected="selected" @closeWindow="closeWindow" />
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div v-for="win in windows" class="swiper-slide">
          <tablist-page :tabs="win.tabs" :thumbs="thumbs" @click="tabclick" @mouseenter="mouseenter" @close="close" />
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

  let tabdata = { windows: [], thumbs: [], selected: {}, focused: NaN };
  let EE = new EventEmitter();
  let port = null;
  let closeTimer = null;
  let closingTabs = [];
  const chromep = new ChromePromise();

  function closeTab(tabid) {
    port.postMessage({ "message": "closeTab", "tabId": tabid });
  }

  function closeAruTab() {
    port.postMessage({ "message": "closeAruTab" });
  }

  function changeTab(tabid, winid) {
    $("html").css("display", "none").remove();
    port.postMessage({ "message": "changeTab", "tabId": tabid, "windowId": winid });
  }

  function closingTab() {

    $(".closing").css("width", "0").delay(180).queue(() => {
      for (const w of tabdata.windows) {
        w.tabs.forEach((t, i) => {
          closingTabs.forEach(cid => { if (t.id === cid) { w.tabs.splice(i, 1); } })
        });
        w.tabs.forEach(t => console.log(t.id));
      }
    });
  }

  let App = {
    name: "tablist",
    data: function () {
      return tabdata;
    },
    components: { "tablist-page": TablistPage, "win-header": WinHeader },
    methods: {
      tabclick: function (tab) { changeTab(tab.id, tab.windowId); },
      mouseenter: function (tab) { tabdata.selected = tab },
      close: function (tab) {
        closeTab(tab.id);
        closingTabs.push(tab.id);
        if (closeTimer) clearTimeout(closeTimer);
        closeTimer = setTimeout(() => closingTab(tab.id), 1000);

      },
      closeWindow: function () {
        closeAruTab();
      }
    },
    updated: function () {
      if (isNaN(tabdata.focused)) return;
      const slider = $(".swiper-container");
      if (slider[0].swiper) {
        slider[0].swiper.update();
        if (tabdata.windows.length == 1)
          slider[0].swiper.lockSwipes();
        else
          slider[0].swiper.unlockSwipes();
      } else {
        slider.swiper({
          mousewheelControl: true,    // Optional parameters
          loop: true,
          initialSlide: tabdata.focused,

          // If we need pagination
          pagination: '.swiper-pagination',
          paginationClickable: true,

          // Navigation arrows
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          onSlideChangeEnd: (s) => { s.fixLoop(); }

        });
        if (tabdata.windows.length == 1)
          slider[0].swiper.lockSwipes();
        else
          slider[0].swiper.unlockSwipes();
      }
    }
  };
  export default App;


  function getWindows() {
    return new Promise(res => {
      port.postMessage({ "message": "getWindows" });
      EE.once("getWindows", res);
    });
  }

  function initConnection() {
    port = chrome.runtime.connect(null, {});
    port.onMessage.addListener((arg) => {
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

body{
  background:#333;
  margin:0;
}
.tablist-invisible{
  display:none;
}
</style>