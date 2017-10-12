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
      // authors: [],
      // genres: [],
      // books:[],
      // reqUrl:{
      //   home:"http://localhost/bookShop/client/api/",
      //   class:"http://192.168.0.15/~user9/bookShop/client/api/"
      // },
      // location: 'home'

    }
  },
  created(){
    // this.getAuthors()
    // this.getGenres()
    // this.getBooks()
  },
  // methods:{
  //   getAuthors: function(){
  //     var self = this
  //       var xhr = new XMLHttpRequest()
  //       // http://192.168.0.15/~user9/bookShop/client/api/
  //       xhr.open('GET', self.requestUrl+'authors/', true)
  //       xhr.send();
  //         xhr.onreadystatechange = function() {
  //           if (xhr.readyState != 4) return
  //             if (xhr.status != 200) {
  //                   alert(xhr.status + ': ' + xhr.statusText)
  //             } else {
  //             self.authors = JSON.parse(xhr.responseText)
  //             }
  //       }
  //   },
  //   getGenres: function(){
  //     var self = this
  //       var xhr = new XMLHttpRequest()
  //       xhr.open('GET', self.requestUrl+'genres/', true)
  //       xhr.send();
  //         xhr.onreadystatechange = function() {
  //           if (xhr.readyState != 4) return
  //             if (xhr.status != 200) {
  //                   alert(xhr.status + ': ' + xhr.statusText)
  //             } else {
  //             self.genres = JSON.parse(xhr.responseText)
  //             }
  //       }
  //   },
  //   getBooks: function(){
  //     var self = this
  //       var xhr = new XMLHttpRequest()
  //       // xhr.open('GET', 'http://192.168.0.15/~user9/bookShop/client/api/books/', true)
  //       xhr.open('GET', self.requestUrl+'books/', true)
  //       xhr.send();
  //         xhr.onreadystatechange = function() {
  //           if (xhr.readyState != 4) return
  //             if (xhr.status != 200) {
  //                   alert(xhr.status + ': ' + xhr.statusText)
  //             } else {
  //             self.books = JSON.parse(xhr.responseText)
  //             }
  //       }
  //   }
  // },
  computed:{
  //   filteredBooks(){
      
    // },
    requestUrl(){
      var self = this
      if(self.location == 'home'){
        return self.reqUrl.home
      }
      else{
        return self.reqUrl.class
      }
    },
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
