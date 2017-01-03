<template>
    <ul :class="tablistClass">
        <tab v-for="tab in tabs" :style="tabStyle" :tab="tab" :thumb="thumbs[tab.id]" 
        @click="emitEvent('click',$event)" @mouseenter="emitEvent('mouseenter',$event)" @close="emitEvent('close',$event)"
        />
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
ul.tablist9 li{
    width:33%;
    height:33%;
}
ul.tablist12 li{
    width:25%;
    height:33%;
}
ul.tablist16 li{
    width:25%;
    height:23%;
}
ul.tablist25 li{
    width:20%;
    height:18%;
}
</style>

<script>
    import Tab from "./tab.vue";
    export default {
        name: "tablist-page",
        props: {
            "tabs": Array,
            "thumbs": Object,
            "onHover": Function
        },
        computed: {
            tablistClass: function () {
                const size = (this.tabs.length <= 9 ? 9 : (this.tabs.length <= 12 ? 12 : (this.tabs.length <= 16 ? 16 : 25)));
                return ["tablist", "tablist" + size]
            },
            tabStyle: function () {
                return this.tabs.length <= 16 ? {} : { height: 100 / (((this.tabs.length + 4) / 5) | 0) + "%" };
            }
        },
        methods: {
            emitEvent: function (name, tab) { this.$emit(name, tab); }
        },
        components: { "tab": Tab }
    }
</script>