import Vue from 'vue'
import TabList from './tablist.vue'

new Vue({
  el: '#app',
  render: h => h(TabList)
})

document.addEventListener( "wheel",e => {
  e.preventDefault();
})