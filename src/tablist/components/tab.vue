<template>
    <li>
        <div class="header">
            <img class="favicon" :src="favicon" />
            <div class="title_url">
                <span class="title">{{ tab.title }}</span><br />
                <span class="url">{{ tab.url }}</span>
            </div>
            <div class="closebutton" @click.stop="close" />
        </div>
        </div>
        <div class="thumbarea">
            <img :src="thumb" class="thumb" />
        </div>
    </li>
</template>

<script>
    export default {
        name: "tab",
        props: { tab: Object, thumb: String },
        computed: {
            favicon: function () {
                this.tab.faviconUrl || "chrome://faviconi/largest/" + this.tab.url
            }
        },
        methods : {
            close : function(){  }
        }
    }
</script>
</script>

<style>

</style>