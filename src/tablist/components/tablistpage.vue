<template>
    <ul :class="tablistClass">
        <tab v-for="tab in tabs" :style="" :tab="tab" :thumb="thumbs[tab.id]" />
    </ul>
</template>

<style>
ul.tablist{
    list-style-type: none;
    width:100%;
    display:flex;
    flex-wrap:wrap;
    padding:0;
    height:calc(100vh - 60px);
    margin:0;
    z-index:1000000;
}
ul.tablist30 li{
    width:33%;
    height:33vh;
}
ul.tablist25 li{
    width:25%;
    height:23vh;
}
ul.tablist20 li{
    width:20%;
    height:18vh;
}
</style>

<script>
    import Tab from "./tab.vue";
    export default {
        name: "tablist-page",
        props: {
            "tabs": Array,
            "thumbs": Array
        },
        computed: {
            tablistClass: function () {
                const size = (this.tabs.length <= 9 ? 30 : (this.tabs.length <= 16 ? 25 : 20));
                return ["tablist", "tablist" + size]
            },
            tabStyle: function () {
                return { height: 100 / (((this.tabs.length + 4) / 5) | 0) + "%" };
            }
        },
        components: { "tab": Tab }
    }
</script>