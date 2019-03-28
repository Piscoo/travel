<template>
  <div>
    <router-link :to="{name:'update'}">
      <div class="base_info">
        <img class="avatar" :src="user.headUrl" alt>
        <div class="info">
          <div class="content">
            <span class="name">{{user.userName}}</span>
            <div class="like">
              <!-- <img src="~assets/kiw/icon_index_like_us2@2x.png" alt=""> -->
              188
            </div>
          </div>
          <div class="idNumber">ID{{user.userNo}}</div>
        </div>
        <img src="~assets/kiw/list_icon_in_normal@2x.png" alt class="arrowRight">
      </div>
    </router-link>
    <grid class="grid" :show-vertical-dividers="dividers">
      <grid-item label class="grid-item" :link="{name: 'MyActivity',params:{type:1}}">
        <span>{{user.activityTotal}}</span>
        <p>报名活动</p>
      </grid-item>
      <!-- <grid-item label class="grid-item" :link="{name: 'MyActivity',params:{type:2}}">
        <span>{{user.activityTotal}}user.activityMemberTotal</span>
        <p>发起活动</p>
      </grid-item> -->
      <grid-item label class="grid-item" :link="{name: 'message'}">
        <span>{{user.activityRatingTotal}}</span>
        <p>我的留言</p>
      </grid-item>
    </grid>
    <group class="grounp">
      <cell class="cell" title="我的钱包" :link="{name: 'wallet'}" :value="'余额:¥'+user.balance" is-link>
        <img slot="icon" src="~assets/kiw/icon_myself_wallet_dis@2x.png" alt>
      </cell>
      <cell class="cell" title="我的好友" :link="{name: 'friend'}" is-link>
        <img slot="icon" src="~assets/kiw/icon_myself_wallet_dis1@2x.png" alt>
      </cell>
      <cell class="cell" title="申请成为赛事合伙人" :link="{name: 'partner'}" value is-link>
        <img slot="icon" src="~assets/kiw/icon_myself_wallet_dis2@2x.png" alt>
      </cell>
      <cell class="cell" title="编辑资料" :link="{name: 'update'}" value is-link>
        <img slot="icon" src="~assets/kiw/icon_myself_wallet_dis4@2x.png" alt>
      </cell>
    </group>
    <group class="grounp">
      <cell class="cell" title="联系我们" :link="{name: 'contact'}" value is-link>
        <img slot="icon" src="~assets/kiw/icon_myself_wallet_dis3@2x.png" alt>
      </cell>
    </group>
  </div>
</template>
<script>
import { Grid, GridItem, Group, Cell } from "vux";
export default {
  name: "centerIndex",
  components: { Grid, GridItem, Group, Cell },
  methods: {},
  beforeCreate() {
    this.$store.commit("updateTabbar", { tabbar: 3 });
    // this.$store.commit("updateIsHeader", { isHeader: false }); // 显示头部
    this.ajax({
      method: "get",
      url: "/app/user",
      data: {},
      success: res => {
        console.log(res)
        this.user=res.data;
      }
    });
  },
  data() {
    return {
      dividers: false,
      user:{}
    };
  }
};
</script>
<style lang="less" scoped>
.base_info {
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  display: flex;
  padding: 2rem 0;
  position: relative;
  .avatar {
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    margin-left: 2rem;
  }
  .info {
    margin-left: 1rem;
    display: flex;
    flex-direction: column;
    .content {
      display: flex;
      flex-direction: row;
      .name {
        font-size: 1.42rem;
      }
      .like {
        background: rgba(0, 181, 255, 1);
        border-radius: 0.17rem;
        margin-left: 0.5rem;
        color: #fff;
        height: 1.6rem;
        line-height: 1.6rem;
        position: relative;
        padding: 0 0.3rem;
        box-sizing: border-box;
        top: 0.2rem;
        img {
          width: 0.64rem;
          height: 0.63rem;
          vertical-align: top;
        }
      }
    }
    .idNumber {
      margin-top: 1rem;
      font-weight: 500;
      font-size: 1rem;
      color: rgba(152, 152, 152, 1);
    }
  }
  .arrowRight {
    width: 3rem;
    height: 3rem;
    position: absolute;
    top: 50%;
    margin-top: -1.5rem;
    right: 0;
  }
}
.grid {
  margin-top: 1rem;
  background: #fff;
  border: 1px solid transparent;
  .grid-item {
    color: #000;
    text-align: center;
    span {
      font-size: 1.42rem;
      line-height: 2rem;
    }
    p {
      color: rgba(152, 152, 152, 1);
    }
  }
}
.grounp {
  .cell {
    position: relative;
    img {
      width: 2rem;
      height: 2rem;
      vertical-align: middle;
      margin-right: 0.3rem;
    }
  }
}
a {
  color: #f8c301;
}
</style>
