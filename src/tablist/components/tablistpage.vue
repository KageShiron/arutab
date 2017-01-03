<template>
    <ul>
        <tab v-for="tab in tabs" :tab="tab" :thumb="thumbs[tab.id]" />
    </ul>
</template>

<script>
    import Tab from "./tab.vue";
    export default {
        name: "tablist-page",
        props: {
            "tabs": Array,
            "thumbs": Array
        },
        components: { "tab": Tab }
    }
</script>