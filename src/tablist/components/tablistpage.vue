<template>
    <ul>
        <tab v-for="tab in tabs" :tab="tab" :thumb="" />
    </ul>
</template>

<script>
    import Tab from "./tab.vue";
    export default {
        name : "tablist-page",
        props : {
            "tabs" : Object
        },
        components : [Tab]
    }
</script>