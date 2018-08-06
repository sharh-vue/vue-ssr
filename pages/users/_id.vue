<template>
  <div>
    <div>Number 2 {{$route.params.id}}</div>
    <button @click="goUser">switch pages{{$store.state.name}}</button>
    <button @click="test">2</button>
    <img src="~assets/figure.png"/>
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
      },
      test(){
        console.log('test')
      }
    }
  }
</script>