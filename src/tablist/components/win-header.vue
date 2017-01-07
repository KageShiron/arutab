<template>
    <div class="win-header">
        <div class="header">
            <img class="favicon" :src="favicon" />
            <div class="title_url">
                <span class="title">{{ selected.title }}</span><br />
                <span class="url">{{ selected.url }}</span>
            </div>
        </div>
        <div class="controller">
            <div class="swiper-button-prev"></div>
            <div class="swiper-pagination"></div>
            <div class="swiper-button-next"></div>

            <div class="swiper-scrollbar"></div>
            <div class="frameclose" @click="closeWindow" ><img src="../assets/close.svg" /></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "win-header",
        props: {
            "selected": Object
        },
        computed: {
            favicon: function () {
                return this.selected.favIconUrl || "chrome://favicon/largest/" + this.selected.url
            }
        },
        methods : {
            closeWindow : function(){ this.$emit("closeWindow"); }
        }
    }
</script>

<style>
.swiper-pagination , .swiper-button-prev , .swiper-button-next{
    position:relative !important;
    left:auto !important;
    right:auto !important;
    padding:0 10px !important;
    margin:0 !important;
    top:0 !important;
    height:55px !important;
}
.swiper-pagination{
    display:flex;
    justify-content: center;
    align-items: center;
}
.swiper-pagination-bullet.swiper-pagination-bullet-active{
    background-image:url("../assets/bullet-active.svg") !important;
}
.swiper-pagination-bullet{
    opacity: 1!important;
    padding:15px;
    width:20px !important;
    height:20px !important;
    background:none !important;
    background-image:url("../assets/bullet.svg") !important;
    background-repeat: no-repeat !important;
    background-position: center!important;
}

.swiper-button-next{
    padding-left:0 !important;
    background-image:url("../assets/next.svg") !important;
}
.swiper-button-prev{
    padding-right:0 !important;
    background-image:url("../assets/prev.svg") !important;
}

.win-header{
    background-color:#444;
    overflow:hidden;
    text-overflow:ellipsis;
    box-sizing:border-box;
    display:flex;
    height:55px;
}

.win-header .header{
    padding:10px;
}

.controller{
    display:flex;
}

ul.slider{
    margin:0;
    padding:0;
}
</style>