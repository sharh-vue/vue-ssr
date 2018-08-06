<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script type="text/javascript">
  export default {
    data(){
      return {
        msg: 'laytout.vue'
      }
    },
    mounted(){
      console.log(this.msg)
    }
  }  
</script>
<style scoped>
  
</style>