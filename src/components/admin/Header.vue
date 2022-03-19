<template>
  <el-card class="admin-header">
    <img src="../../assets/icon2.png" alt="" width="55px" style="float: left;margin-top: -5px;">
    <span style="font-size: 32px;font-weight: bold;position:absolute;left: 100px" >
      <a href="/index" class="a">首 页</a>
    </span>
    <i class="el-icon-switch-button" v-on:click="logout" style="font-size: 40px;float: right"></i>
  </el-card>
</template>

<script>
  import {createRouter} from '../../router'

  export default {
    name: 'Header',
    methods: {
        logout (){
            let _this =this;
            this.$axios.get("/user/logout")
                .then(resp =>{
                    if(resp.data.code === 200){
                        _this.$store.commit('logout')
                        _this.$router.replace('/')
                    }

                })
        }
    }
  }
</script>

<style scoped>
  .admin-header {
    height: 80px;
    opacity: 0.85;
    line-height: 40px;
    min-width: 900px;
  }
  .el-icon-switch-button {
    cursor: pointer;
    outline:0;
  }
  .a{
    text-decoration:none;
  }
</style>
