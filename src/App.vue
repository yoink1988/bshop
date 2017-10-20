<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
  data(){
    return{
      data:'wqqqqqqqqqqqqqqqqqqqq'
    }
  },
  created(){
  },
  methods:{
    testik:function(){
      alert('TEST')
    }
  },
  computed:{

  }
  
}
</script>

<style>
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50; */
  /* background-color: #f0bc86; */
  margin: 0 auto;
  width: 1250px;
}

body{
    background-color: #fac287;
}

/* .menu{
  margin-top: 20px;
} */
.log-form{
  margin-top:30px;
  margin-right:20px;
  margin-bottom: 80px;
  text-align: right;
}
</style>
