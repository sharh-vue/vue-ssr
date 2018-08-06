<template>
  <div>
      this is &nbsp;&nbsp;&nbsp;&nbsp; index page
    <button @click="goUser">go user</button>
    <div class="png-loader"></div>
    <!-- <img src="~assets/figure.png"/> -->
  </div>
</template>
<script type="text/javascript">
  export default {
    methods: {
      goUser(){
        this.$router.push('/users/1')
      }
    }
  }
</script>
<style lang="css" scoped>
.png-loader{
  height: 200px;
  width: 300px;
  background-image: url('~assets/figure.png');
}
</style>
