<template>
  <div class="main">
    <div class="row">

      <div class="col-md-2 left">
        <div class="row menu">
          <p><b>Welcome</b></p>
          <p>Log In</p>
          <div class="log-form">
          <p>Email:<input v-model="login.email" type="text"></p>
          <p>Password:<input v-model="login.pass" type="text"></p>
          <button @click="signIn" class="login">Log In</button>
          <p><router-link :to="'/register/'">Registration</router-link></p>
          </div>
        </div>
        <div class="showbooks">
          <h4><a  href="#" @click="setFilter('','')" >Show All books</a></h4>
        </div>
        <div class="authors">
          <h4>Authors:</h4>
          <div v-for="author in authors">
            <a  href="#" @click="setFilter('author', author.id)" >{{author.name}}</a>  
          </div>
        </div>
        <div class="genres">
          <h4>Genres:</h4>
          <div v-for="genre in genres">
            <a  href="#" @click="setFilter('genre', genre.id)" >{{genre.name}}</a>  
          </div>
        </div>
        <div class="books">
          <h4>Books:</h4>
          <div v-for="book in books">
            <router-link :to="'books/'+book.id">{{book.title}}</router-link>  
          </div>
        </div>

      </div>
      <div class="col-md-10 right">
              <h2>Book Shop</h2>
        <div class="books-section col-md-10">
          <table>
          <tr><td class="title"><b>Title</b></td>
          <td class="description"><b>Description</b></td>
          <td class="price"><b>Price</b></td>
          <td class="price"><b>Authors</b></td>
          <td class="price"><b>Genres</b></td>
          <td class="discount"><b>Discount</b></td>
          <td class="discount"><b>Discounted price</b></td></tr>
          <tr v-for = "book, key in filteredBooks">
          <td class="title"><router-link :to="'/books/'+book.id">{{book.title}}</router-link></td>
          <td class="description">{{book.description}}</td>
          <td class="price">{{book.price}} $</td>
          <td>
            <p v-for = "author in book.authors"><a  href="#" @click="setFilter('author', author.id)" >{{author.name}}</a></p>
          </td>
          <td>
            <p v-for = "genre in book.genres"><a  href="#" @click="setFilter('genre', genre.id)" >{{genre.name}}</a></p>
            <!-- <router-link v-for = "genre in book.genres"><router-link :to="'/books/genre/'+genre.id" >{{genre.name}}   </router-link> </p> -->
          </td>
          <td class="discount">{{book.discount}} %</td>
          <td class="discounted">{{(book.price - book.price*book.discount/100).toFixed(2)}} $</td>
      </tr>
    </table>

        </div>   
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home',
  data () {
    return {
      login:{
        email:'',
        pass:''
      },
      filter:{type:"",id:""},
      authors: [],
      genres: [],
      books:[],
    }
  },
  created(){
    this.getAuthors()
    this.getGenres()
    this.getBooks()
  },
    methods:{
      signIn: function(){
      var self = this
      var xhr = new XMLHttpRequest();
      var json = JSON.stringify({
         login: self.login.email,
         pass: self.login.pass
      });

          xhr.open("PUT", self.$parent.requestUrl+'auth/', true)
          xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
          // xhr.withCredentials = true;
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return
                  if (xhr.status != 200) {
                        alert(xhr.status + ': ' + xhr.statusText)
                  } else {
                    console.log(xhr.responseText)
                    console.log(xhr.getAllResponseHeaders())
                    var date = new Date(new Date().getTime() + 60 * 1000);
                    document.cookie = "name=value; path=/; expires=" + date.toUTCString();
                  }
            }
          xhr.send(json)
      },
    getAuthors: function(){
      var self = this
        var xhr = new XMLHttpRequest()
        // http://192.168.0.15/~user9/bookShop/client/api/
        xhr.open('GET', self.$parent.requestUrl+'authors/', true)
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
        xhr.open('GET', self.$parent.requestUrl+'genres/', true)
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
        // xhr.open('GET', 'http://192.168.0.15/~user9/bookShop/client/api/books/', true)
        xhr.open('GET', self.$parent.requestUrl+'books/', true)
        xhr.send();
          xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return
              if (xhr.status != 200) {
                    alert(xhr.status + ': ' + xhr.statusText)
              } else {
                self.books = JSON.parse(xhr.responseText)
                console.log(self.books)
              }
        }
    },
    setFilter: function(type, id){
      var self = this
      self.filter.type = type
      self.filter.id = id
      self.refreshed = false
    }

  },
  // components:{
  //   'book-section': Book
  // },
  computed:{
    filteredBooks(){
      var self = this

      var books = self.books

      if(self.filter.type){

      var type = self.filter.type
      var rule = self.filter.id

      if(type == 'author'){
      var result = [];
            books.forEach(function(el, books){
              el.authors.forEach(function(a, authors){
                if(a.id.includes(rule))
                {
                    result.push(el)
                }
              })
            });  
        }
      else if(type == 'genre'){
      var result = [];
            books.forEach(function(el, books){
              el.genres.forEach(function(a, genres){
                if(a.id.includes(rule))
                {
                    result.push(el)
                }
              })
            });  
        }
       return result
      }

      else{
        return books
      }

    },
      requestUrl(){
      var self = this
      if(self.location == 'home'){
        return self.reqUrl.home
      }
      else
      {
        return self.reqUrl.class
      }
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

/* .books-section{
  margin: left 10%;
} */

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

td{
  padding:20px;
}
th{
  padding:20px;
}

table{
  margin-top: 40px;
}
</style>
