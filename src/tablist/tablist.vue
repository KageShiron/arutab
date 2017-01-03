<template>
  <div id="tablist">
    <tablist-page v-for="win in windows" :tabs="win.tabs" :thumbs="thumbs" >
  </div>
</template>

<script>
  import EventEmitter from 'eventemitter3'
  import TablistPage from './components/tablistpage.vue'
  import ChromePromise from "chrome-promise"

  let tabdata = { windows: [] , thumbs : [] };
  let EE = new EventEmitter();
  const chromep = new ChromePromise();
  let App = {
    name: "tablist",
    data: function () {
      return tabdata;
    },
    components: { "tablist-page": TablistPage }
  };
  export default App;

  let port = null

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
      for( const w of wins) 
          for (const t of w.tabs) def.push("" + t.id);

      chromep.storage.local.get(def).then( items => {
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