<template>
  <div class="addmsg">
    <form ref="form">
      <group gutter="0">
        <x-textarea :max="1000" placeholder="想说些点什么..." name="mesa" v-model="form.mesa" required></x-textarea>
      </group>
    </form>
  </div>
</template>
<script>
import { XTextarea, Group,Toast } from "vux";
export default {
  name: "addmsg",
  components: { XTextarea, Group,Toast },
  methods: {
    saveMsg() {
      if (this.formValid()) {
        this.ajax({
          method: "post",
          url: "/app/user/add-activity-rating",
          data: {
            comment: this.form.mesa,
            activityId: this.activityId,
            type: 1
          },
          success: res => {
            this.$vux.toast.show({
              text: "保存成功"
            });
            this.$router.back(-1);
          }
        });
      }
    }
  },
  beforeCreate() {
    this.$store.commit("updateTabbar", { tabbar: -1 });
    this.$store.commit("updateShowMore", { showMore: "保存" });
    // this.$store.commit("updateShowBack", { showBack: true });
    // this.$store.commit("updateIsHeader", { isHeader: false }); // 显示头部
    this.$nextTick(() => {
      this.activityId = this.$route.params.activityId;
    });
  },
  created() {
    this.$store.commit("updateClickMore", { onClickMore: this.saveMsg });
  },
  data() {
    return {
      activityId: "",
      form: {
        mesa: ""
      }
    };
  }
};
</script>
<style lang="less" scoped>
</style>
