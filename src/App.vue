<template>
  <div id="app">
    <div class="row">
      <div class="col-md-2 left">
        <div class="row menu">
          <p><b>Welcome</b></p>
          <p>Log In</p>
          <div class="log-form">
          <p>Email:<input type="text"></p>
          <p>Password:<input type="text"></p>
          <button class="login">Log In</button>
          <p><router-link :to="'/register/'">Registration</router-link></p>
          </div>
        </div>
        <div class="authors">
          <h4>Authors:</h4>
          <div v-for="author in authors">
            <!-- <p>{{author.name}}</p> -->
            <router-link :to="'/books/author/'+author.id">{{author.name}}</router-link>  
          </div>
        </div>
        <div class="genres">
          <h4>Genres:</h4>
          <div v-for="genre in genres">
            <!-- <p>{{author.name}}</p> -->
            <router-link :to="'/books/genre/'+genre.id">{{genre.name}}</router-link>  
          </div>
        </div>
        <div class="books">
          <h4>Books:</h4>
          <div v-for="book in books">
            <!-- <p>{{author.name}}</p> -->
            <router-link :to="'books/'+book.id">{{book.title}}</router-link>  
          </div>
        </div>

      </div>
      <div class="col-md-10 right">
        <!-- <div class="right"> -->
           <router-view/>
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data(){
    return{
      authors: [],
      genres: [],
      books:[]
    }
  },
  created(){
    this.getAuthors()
    this.getGenres()
    this.getBooks()
  },
  methods:{
    getAuthors: function(){
      var self = this
        var xhr = new XMLHttpRequest()
        // http://192.168.0.15/~user9/bookShop/client/api/
        xhr.open('GET', 'http://192.168.0.15/~user9/bookShop/client/api/authors/', true)
        xhr.send();
          xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return
              if (xhr.status != 200) {
                    alert(xhr.status + ': ' + xhr.statusText)
              } else {
              self.authors = JSON.parse(xhr.responseText)
              }
        }
    },
    getGenres: function(){
      var self = this
        var xhr = new XMLHttpRequest()
        xhr.open('GET', 'http://192.168.0.15/~user9/bookShop/client/api/genres/', true)
        xhr.send();
          xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return
              if (xhr.status != 200) {
                    alert(xhr.status + ': ' + xhr.statusText)
              } else {
              self.genres = JSON.parse(xhr.responseText)
              }
        }
    },
    getBooks: function(){
      var self = this
        var xhr = new XMLHttpRequest()
        xhr.open('GET', 'http://192.168.0.15/~user9/bookShop/client/api/books/', true)
        xhr.send();
          xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return
              if (xhr.status != 200) {
                    alert(xhr.status + ': ' + xhr.statusText)
              } else {
              self.books = JSON.parse(xhr.responseText)
              }
        }
    }
  },
  computed:{
    filteredBooks(){
      
    }
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

.menu{
  margin-top: 20px;
}
.log-form{
  margin-top:30px;
  margin-right:20px;
  margin-bottom: 80px;
  text-align: right;
}
</style>
