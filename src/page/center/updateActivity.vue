<template>
  <div class="support">
    <form ref="form">
      <group title="内容修改">
        <x-input title="活动名称" v-model="form.title" placeholder="运动领跑活动" name="title" requires></x-input>
        <x-input title="支持宣言" v-model="form.supportDecl" placeholder="运动是成功之母"></x-input>
      </group>
      <group style="display:none;" >
        <checklist :options="[1]" :max="1">
          <span>testtest</span>
        </checklist>
      </group>

      <div>
        <p class="weui-cells__title">众筹方案修改</p>
        <div class="weui-cells vux-no-group-title">
          <div class>
            <div class="weui-cells weui-cells_checkbox" v-for="(item, index) in moneyList">
              <label :for="'checkbox_' + index" class="weui-cell weui-check_label">
                <div class="weui-cell__hd">
                  <input
                    type="checkbox"
                    name="vux-checkbox"
                    :id="'checkbox_' + index"
                    class="weui-check"
                    :value="item"
                    v-model="form.payAmounts"
                  >
                  <i class="weui-icon-checked vux-checklist-icon-checked"></i>
                </div>
                <div class="weui-cell__bd">
                  <p>
                    {{item}}元
                    <span v-show="moneyDefault.indexOf(item) !== -1">（默认）</span>
                  </p>
                  <!--  v-show="item == moneyDefault" -->
                </div>
              </label>
              <span
                class="right"
                v-show="moneyDefault.indexOf(item) === -1"
                @click.stop.prevent="deleteitem(index)"
              >删除</span>
            </div>
          </div>
        </div>
      </div>
      <router-link :to="{ name: 'newMoney' }">
        <div class="newType" v-show="moneyList.length===10?false:true">新增支持方案</div>
      </router-link>

      <div class="poster">
        <div class="title">宣传海报</div>
        <label
          for="uploadFile"
          class="cover-img"
          :style="'background-image: url('+(poster || require('~assets/kiw/ph@2x.png'))+')'"
        >
          <!-- <img src="~assets/pisco/ph_three.png" alt=""> -->
          <div class="upload">点击可上传海报</div>
        </label>
        <input type="file" id="uploadFile" @change="uploadFile" class="visibility-none">
      </div>
    </form>
  </div>
</template>
<script>
import {
  Group,
  XInput,
  Selector,
  PopupPicker,
  Toast,
  XTextarea,
  Checklist,
  XSwitch
} from "vux";
export default {
  name: "updateActivity",
  components: {
    Group,
    XInput,
    Selector,
    PopupPicker,
    Toast,
    XSwitch,
    XTextarea,
    Checklist,
    XSwitch
  },
  watch: {
    "form.payAmounts": {
      handler(val, oldValue) {
        if (val.length > 5) {
          val.shift();
          this.form.payAmounts = val;
        }
      },
      deep: true
    }
  },
  beforeCreate() {
    this.$store.commit("updateTabbar", {
      tabbar: -1
    });
    this.$store.commit("updateShowBack", {
      showBack: true
    });
    this.$store.commit("updateShowMore", {
      showMore: "保存"
    });
  },
  created() {
    var id = this.$route.params.activityId;
    this.activityId = id;
    var key = localStorage.getItem("supportKey");
    if (key) {
      this.moneyList = this.moneyList.concat(JSON.parse(key));
    }
    this.$store.commit("updateClickMore", {
      onClickMore: this.saveInfo
    });
    this.ajax({
      method: "get",
      url: "/app/activities/" + this.activityId,
      data: {},
      success: res => {
        // res.data.detailsImgPath = JSON.parse(res.data.detailsImgPath)[0];
        // this.poster = res.data.detailsImgPath;
        this.poster = res.data.imgsPath;
        res.data.payAmounts = [];
        this.form = res.data;
      }
    });
  },
  methods: {
    saveInfo() {
      if (this.formValid()) {
        this.ajax({
          method: "patch",
          url: "/app/activities/" + this.activityId,
          data: this.form,
          success: res => {
            this.$vux.toast.show({
              text: "保存成功"
            });
          }
        });
      }
    },
    //删除支持方案
    deleteitem(index) {
      this.moneyList.splice(index, 1);
      var supportKey = JSON.stringify(this.moneyList).replace(
        /1,5,10,66,88,{0,1}/,
        ""
      );
      localStorage.setItem("supportKey", supportKey);
      this.$vux.toast.show({
        text: "删除成功"
      });
    },
    // 上传海报图
    uploadFile(e) {
      var file = e.target.files[0];
      this.poster = URL.createObjectURL(e.target.files[0]);
      var formData = new FormData();
      formData.append("file", file);
      this.ajax({
        method: "post",
        url: "/app/oss/upload",
        data: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        success: res => {
          this.form.imgsPath = res.url;
        }
      });
    }
  },
  data() {
    return {
      requires: ["title","payAmounts|未选择支持金额!"],
      form: {
        title: "",
        supportDecl: "",
        payAmounts: []
      },
      poster: require("~assets/pisco/ph_three.png"), //默认海报图
      moneyList: [1, 5, 10, 66, 88],
      moneyDefault: [1, 5, 10, 66, 88]
    };
  }
};
</script>
<style lang="less" scoped>
.support {
  position: relative;
  min-height: 100%;
  overflow: hidden;
  .newType,
  .address {
    width: 100%;
    height: 4.67rem;
    background: rgba(255, 255, 255, 1);
    margin-top: 0.8rem;
    padding-left: 2rem;
    font-size: 1.42rem;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: rgba(65, 65, 65, 1);
    line-height: 4.67rem;
  }
  .notice {
    padding: 2rem 1rem 1rem;
    .title {
      font-size: 1.25rem;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(248, 195, 1, 1);
      line-height: 1.67rem;
    }
    .detail {
      font-size: 1rem;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(200, 200, 200, 1);
      line-height: 1.67rem;
    }
  }
  .gonext {
    width: 100%;
    height: 4.08rem;
    background: rgba(248, 195, 1, 1);
    font-size: 1.42rem;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    color: rgba(65, 65, 65, 1);
    line-height: 4.08rem;
    text-align: center;
    position: absolute;
    bottom: 0;
  }
}
.right {
  float: right;
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  color: #f00;
}
.weui-cells_checkbox {
  position: relative;
  margin-top: 0;
}
.title {
  color: rgba(132, 132, 132, 1);
  line-height: 1.75rem;
  margin-left: 2rem;
  font-size: 1.25rem;
}
.poster {
  margin-top: 1.25rem;
  background: #fff;
  padding-bottom: 1.25rem;
  padding: 1.25rem;
  .title {
    font-size: 1.42rem;
    color: #414141;
  }
  .cover-img {
    display: block;
    width: 100%;
    height: 14rem;
    position: relative;
    margin-top: 1.25rem;
    .upload {
      height: 3.67rem;
      width: 100%;
      line-height: 3.67rem;
      text-align: center;
      color: #f8c301;
      font-size: 1.25rem;
      position: absolute;
      bottom: 0;
      background: rgba(0, 0, 0, 0.2);
    }
  }
}
</style>


