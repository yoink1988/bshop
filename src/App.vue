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

}
</script>

<style>
#app {
  margin: 0 auto;
  width: 1250px;
}

body{
    background-color: #FFDCA8;
}

.log-form{
  margin-top:30px;
  margin-right:20px;
  margin-bottom: 80px;
  text-align: right;
}
</style>
