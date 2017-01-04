<template>
    <li :key="tab.id" :class="tabClass" @click="emitEvent('click')" @mouseenter="emitEvent('mouseenter')">
        <div class="header">
            <img class="favicon" :src="favicon" />
            <div class="title_url">
                <span class="title">{{ tab.title }}</span><br />
                <span class="url">{{ tab.url }}</span>
            </div>
            <div class="closebutton" @click.stop="close">
                <img src="../assets/close.svg" />
            </div>
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
        data: function () { return { closing: false } },
        computed: {
            favicon: function () {
                return this.tab.faviconUrl || "chrome://favicon/largest/" + this.tab.url
            },
            tabClass: function () {
                return ["tab", this.closing ? "closing" : ""];
            }
        },
        methods: {
            emitEvent: function (name) { this.$emit(name, this.tab) },
            close: function () {
                this.closing = true;
                this.emitEvent("close");
            }
        }
    }
</script>

<style>
.favicon{
    height:32px;
    width:32px;
    vertical-align:middle;
    float:left;
    margin-right:5px;
}

.tab{
  padding:5px 10px;
  margin:0;
  display: flex;
  flex-direction: column;
  min-height:100px;
  box-sizing: border-box;
  padding:10px;
  position:relative;
  transition:left 100ms ease,
                width 200ms ease;
}


.closebutton img{
    height:10px;
}

.tab:hover .closebutton{
    bottom:7px;
    background-color:rgba(255,200,200,0.5);
}


.closebutton:hover{
    background-color:rgba(255,200,200,0.8);
}
.thumb{
  border:1px solid #444;
  display:block;
  clear:both;
  background:#FFF;
  zoom:0.5;
}

.thumbarea{
    overflow:hidden;
    flex:1;
    background-color: white;
}

.header{
  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
  display:inline-block;
  color:#DDD;
  width:100%;
  height:35px;
}

.closebutton{
    position:absolute;
    float:left;
    bottom:10px;
    width:40px;
    height:40px;
    color:#999;
    text-align:center;
    vertical-align: middle;
    font-size:40px;
    background-color:rgba(255,200,200,0.2);
    display:flex;
    justify-content: center;
    align-items: center;
}

.removing{
    transition:opacity 100ms ease;
    opacity:0 !important;
}


.tab:hover{
    border:3px solid #999;
    padding:7px;
    background:#444;
}


.tab.actived{
    background-color:#445;
}

.title{
    font-size:17px;
    line-height:17px;
}
.url{
    font-size:13px;
    line-height:13px;
    color:#999;
}

</style>