<template>
  <div id="tablist">
    <tablist-page :tabs="tabs">
  </div>
</template>

<script>
  let tabdata = {};
  let App = {
    name: "tablist",
    data: function () {
      return tabdata;
    }
  };
  export default App;
</script>

<style>
</style>