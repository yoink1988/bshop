<template>
  <div class="main">
    <div class="row">
      <div class="col-md-2 left">
        <div class="row menu">
          <p><b>Welcome {{user.name}}</b></p>
          <div v-if="user.name == ''" class="log-form">
            <p>Log In</p>
            <p>Email:<input v-model="login.email" type="text"></p>
            <p>Password:<input v-model="login.pass" type="text"></p>
            {{logMsg}}
            <button @click="signIn" class="login">Log In</button>
           <p><router-link :to="'/register/'">Registration</router-link></p>
          </div>
          <div v-else class="logged">
            <p><a href="#" @click="logOut()">Log Out</a></p>
           <p><a href="#" @click="showCart()">Cart</a></p>
           <p><a href="#" @click="showOrders()">My Orders</a></p>
          <div v-if="user.role == 'admin'" class="admin">
            <p><router-link :to="'/admin/'" :role="user.role">Admin Panel</router-link></p>
          </div>
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
            <a href="#" @click="showBookInfo(book)">{{book.title}}</a>  
          </div>
        </div>

      </div>
      <div class="col-md-10 right">
              <h2>Book Shop</h2>

        <div v-if="ordered">
          Thank You!
        </div>

        <div v-if="orders">
          <order-section :user="user"></order-section>
        </div>

        <div v-if="selectedBook">
        <book-section :book="selectedBook" :user="user"></book-section>        
         </div>
         <div v-if="cart">
           <cart-section :user="user"></cart-section>
         </div>
      <div v-if="allBooks">
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
          <td class="title"><a href="#" @click="showBookInfo(book)">{{book.title}}</a></td>
          <td class="description">{{book.description}}</td>
          <td class="price">{{book.price}} $</td>
          <td>
            <p v-for = "author in book.authors"><a  href="#" @click="setFilter('author', author.id)" >{{author.name}}</a></p>
          </td>
          <td>
            <p v-for = "genre in book.genres"><a  href="#" @click="setFilter('genre', genre.id)" >{{genre.name}}</a></p>
          </td>
          <td class="discount">{{book.discount}} %</td>
          <td class="discounted">{{(book.price - book.price*book.discount/100).toFixed(2)}} $</td>
            </tr>
            </table>

        </div>  
      </div>

      </div>
    </div>
  </div>
</template>

<script>

import Book from './Book'
import Cart from './Cart'
import Order from './Order'
export default {
  name: 'Home',
  data () {
    return {
      orders: false,
      ordered: false,
      allBooks:true,
      cart:'',
      selectedBook:'',
      user:{},
      logMsg: '',
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
    this.getUserData()
    this.getAuthors()
    this.getGenres()
    this.getBooks()
    this.checkAuth()
  },
    methods:{
      signIn: function(){
      var self = this
      self.logMsg = ''
      var xhr = new XMLHttpRequest();
      var json = JSON.stringify({
         login: self.login.email,
         pass: self.login.pass
      });
      self.clearInputs()
          xhr.open("PUT", getUrl()+'auth/', true)
          xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
          // xhr.withCredentials = true;
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return
                  if (xhr.status != 200) {
                        alert(xhr.status + ': ' + xhr.statusText)
                  } else {
                    // console.log(xhr.responseText)
                    var res = JSON.parse(xhr.responseText)
                    
                    if(typeof(res) == 'string')
                    {
                      self.logMsg = res
                    }
                    else
                    {
                      self.user = res[0]
                      localStorage['user'] = JSON.stringify({id: self.user.id, hash: self.user.hash})
                    }
                    console.log(self.user)
                    console.log(self.logMsg)

                  }
            }
          xhr.send(json)
      },
      showBookInfo: function(book){
        var self = this
        self.selectedBook = book
        self.allBooks = ''
        self.cart = false
        self.ordered = false
      },
    getAuthors: function(){
      var self = this
        var xhr = new XMLHttpRequest()
        // http://192.168.0.15/~user9/bookShop/client/api/
        xhr.open('GET', getUrl()+'authors/', true)
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
        xhr.open('GET', getUrl()+'genres/', true)
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
        xhr.open('GET', getUrl()+'books/', true)
        xhr.send();
          xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return
              if (xhr.status != 200) {
                    alert(xhr.status + ': ' + xhr.statusText)
              } else {
                self.books = JSON.parse(xhr.responseText)
                // console.log(self.books)
              }
        }
    },
    setFilter: function(type, id){
      var self = this
      self.selectedBook = ''
      self.filter.type = type
      self.filter.id = id
      self.refreshed = false
      self.allBooks = true
      self.cart = false
      self.ordered = false
      self.orders = false
    },
        logOut: function(){
        var self = this
        self.ordered = false
        self.user = {}
        self.cart = false
        self.allBooks = true       
        delete localStorage['user']
        self.getUserData()
        self.checkAuth()
      },
      getUserData: function(){
        var self = this
        if(localStorage['user'])
        {
         self.user = JSON.parse(localStorage['user'])
       }
        else
        {
          self.user.name = ''
          self.user.role = 'guest'
          self.user.id = '0'
          self.user.hash = '0'
        }
      },
      checkAuth: function(){
      var self = this
      var xhr = new XMLHttpRequest();
          xhr.open("GET", getUrl()+'auth/id/'+self.user.id+'/hash/'+self.user.hash, true)
          xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return
                  if (xhr.status != 200) {
                        // alert(xhr.status + ': ' + xhr.statusText)
                        self.user.name = 'Guest'
                        self.user.role = 'guest'
                        self.user.id = '0'
                        self.user.hash = '0'
                  } else {
                    self.user = JSON.parse(xhr.responseText)[0]
                    localStorage['user'] = JSON.stringify({id: self.user.id, hash: self.user.hash})
                  }
            }
          xhr.send()        

      },
    clearInputs: function(){
      var self = this
      self.login.email = ''
      self.login.pass = ''
    },
    showCart: function(){
      var self = this
      self.selectedBook = ''
      self.allBooks = false
      self.refreshed = false
      self.ordered = false
      self.orders = false
      self.cart = true
    },
    showOrders: function(){
      var self = this
      self.selectedBook = ''
      self.allBooks = false
      self.refreshed = false
      self.ordered = false
      self.cart = false
      self.orders = true
    }

  },

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
                if(a.id.includes(rule)){
                    result.push(el)
                }
              })
            });  
      }
      else if(type == 'genre'){
      var result = [];
            books.forEach(function(el, books){
              el.genres.forEach(function(a, genres){
                if(a.id.includes(rule)){
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

  },
  components:{
    'book-section': Book,
    'cart-section': Cart,
    'order-section': Order
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
.logged{
  height: 200px;
}

table{
  margin-top: 40px;
}
</style>
