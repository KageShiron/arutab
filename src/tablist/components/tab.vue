<template>
    <li :class="tabClass" @click="emitEvent('click')" @mouseenter="emitEvent('mouseenter')" @touchstart="touchStart($event)"
        @touchmove.prevent="touchMove($event)" @touchend="touchEnd($event)" :style="tabStyle">
        <div class="header">
            <img class="favicon" :src="favicon" />
            <div class="title_url">
                <span class="title">{{ tab.title }}</span><br />
                <span class="url">{{ tab.url }}</span>
            </div>
            <div class="closebutton" @click.stop="close">
                <img src="../assets/close.svg" />
            </div>
            <div :class="['tabinfo',{visible : tab.pinned || tab.audible}]">
                <img :class="{'visible' : tab.pinned}" src="../assets/pinned.svg" />
                <img :class="{'visible' : tab.audible }" src="../assets/audible.svg" />
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
        data: function () { return { closing: false, touch: { x: NaN, y: NaN, deltaX: 0, deltaY: 0 } } },
        computed: {
            favicon: function () {
                return this.tab.faviconUrl || "chrome://favicon/size/16@2x/" + this.tab.url
            },
            tabClass: function () {
                return ["tab", this.closing ? "closing" : ""
                    , this.touch.deltaY > 250 ? "touchclosing" : ""
                    , this.tab.highlighted ? "highlight" : ""];
            },
            tabStyle: function () {
                return {
                    "opacity": ((this.touch.deltaY < -100 || this.touch.deltaY > 100) ? (300 - Math.abs(this.touch.deltaY)) / 200 + 0.5 : 1),
                    "top": this.touch.deltaY + "px"
                }
            }
        },
        methods: {
            emitEvent: function (name) { this.$emit(name, this.tab) },
            close: function () {
                this.closing = true;
                this.emitEvent("close");
            },
            touchStart: function (e) {
                this.touch.y = e.touches[0].pageY;
            },
            touchMove: function (e) {
                const deltaY = e.touches[0].pageY - this.touch.y;
                if (deltaY > 130 || deltaY < -130)
                    this.touch.deltaY = deltaY;
                else
                    this.touch.deltaY = 0;
            },
            touchEnd: function (e) {
                this.touch.y = NaN;
                const delta = Math.abs(this.touch.deltaY);
                if (delta > 250) {
                    this.close();
                } else {
                    this.touch.deltaY = 0;
                }
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


.tab.highlight{
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

.touchclosing{
    background: #660000 !important;
}


.tabinfo img{
    display:none;
}

.tabinfo img.visible{
    display:block;
    margin-right:5px;
    background-color:rgba(255,255,255,0.5);
}

.tabinfo{
    position:absolute;
    float:right;
    right:10px;
    bottom:10px;
    height:30px;
    color:#999;
    text-align:center;
    vertical-align: middle;
    font-size:40px;
    justify-content: center;
    align-items: center;
    display:none;
}

.tabinfo.visible{
    display:flex;
}

.tab:hover .tabinfo{
    bottom:7px;
    right:7px;
    background-color:rgba(255,255,255,0.5);
}

</style>