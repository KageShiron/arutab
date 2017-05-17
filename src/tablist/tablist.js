import Vue from 'vue'
import TabList from './tablist.vue'

const eventHub = new Vue();
export default eventHub;
new Vue({
    el: '#app',
    render: h => h(TabList)
})

document.body.addEventListener("mousewheel",e => {
    e.preventDefault();
})