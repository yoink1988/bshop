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
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: lemonchiffon;
  /* margin-top: 60px; */
}
.left{
  background-color: lightgray;
}
.right{
  background-color: lemonchiffon;
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
