import Vue from 'vue'
import TabList from './tablist.vue'

const eventHub = new Vue();

import ZingTouch from "zingtouch";
eventHub.zingSwipe = new ZingTouch.Swipe()
export default eventHub;
new Vue({
    el: '#app',
    render: h => h(TabList)
})
