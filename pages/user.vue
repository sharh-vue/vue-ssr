<template>
  <div>
    <div>{{$route.params.id}}</div>
    <button @click="goUser"></button>
  </div>
</template>
<script type="text/javascript">
  export default {
    data(){
      return {
        count: +this.$route.params.id || 0
      }
    },
    methods: {
      goUser(){
        this.count++;
        this.$store.dispatch('CHANGE_NAME', 'name_'+this.count)
        this.$router.push('/users/'+this.count)
      }
    }
  }
</script>