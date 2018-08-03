<template>
  <div>
      this is &nbsp;&nbsp;&nbsp;&nbsp; index page
    <button @click="goUser">go user</button>

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