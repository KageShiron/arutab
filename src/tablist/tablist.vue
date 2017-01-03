<template>
  <div id="tablist">
    <win-header :selected="selected" />
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div v-for="win in windows" class="swiper-slide">
          <tablist-page :tabs="win.tabs" :thumbs="thumbs" @click="tabclick" @mouseenter="mouseenter" />
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

  let tabdata = { windows: [], thumbs: [], selected: {} };
  let EE = new EventEmitter();
  let port = null
  const chromep = new ChromePromise();

  let App = {
    name: "tablist",
    data: function () {
      return tabdata;
    },
    components: { "tablist-page": TablistPage, "win-header": WinHeader },
    methods: {
      tabclick: function (tab) { port.postMessage({ "message": "changeTab", "tabId": tab.id }) },
      mouseenter: function (tab) { tabdata.selected = tab }
    },
    updated: function () {
      const slider = $(".swiper-container");
      if (slider[0].swiper) {
        slider[0].swiper.update();
      } else {
        slider.swiper({
          mousewheelControl: true,    // Optional parameters
          loop: true,

          // If we need pagination
          pagination: '.swiper-pagination',
          paginationClickable: true,

          // Navigation arrows
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          onSlideChangeEnd: (s) => { console.log(s); s.fixLoop(); }

        });
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
      console.log(wins);
      tabdata.windows = wins;

      let def = [];
      for (const w of wins)
        for (const t of w.tabs) def.push("" + t.id);

      chromep.storage.local.get(def).then(items => {
        console.log(items);
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
</style>