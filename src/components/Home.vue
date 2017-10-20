<template>
  <div class="main">
    <div class="row">
      <div class="col-md-2 left">
        <div class="row menu">
          <div class="col" style="margin:20px auto">
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
          <div class="row">
        <div v-if="content == 'orders'">
          <order-section :user="user"></order-section>
        </div>

        <div v-if="content == 'book'">
        <book-section :book="selectedBook" :user="user"></book-section>        
        </div>
         <div v-if="content == 'cart'">
           <cart-section :user="user"></cart-section>
         </div>

      <div v-if="content == ''" class="col">
        <!-- <div> -->
          <table>
          <tr class="row">
          <td class="col-md-1"><b>Title</b></td>
          <td class="col-md-5"><b>Description</b></td>
          <td class="col-md-1"><b>Price</b></td>
          <td class="col-md-1"><b>Authors</b></td>
          <td class="col-md-2"><b>Genres</b></td>
          <td class="col-md-1"><b>Discount</b></td>
          <td class="col-md-1"><b>Discounted price</b></td></tr>

          <tr class="row" v-for = "book, key in filteredBooks">
          <td class="col-md-1"><a href="#" @click="showBookInfo(book)">{{book.title}}</a></td>
          <td class="col-md-5">{{book.description}}</td>
          <td class="col-md-1">{{book.price}} $</td>
          <td class="col-md-1">
            <span v-for = "author in book.authors">
               <a  href="#" @click="setFilter('author', author.id)" > 
              {{author.name}} 
              </a>
              </span>
          </td>
          <td class="col-md-2">
            <span v-for = "genre in book.genres">
              <a  href="#" @click="setFilter('genre', genre.id)" > 
                {{genre.name}} 
                </a>
                </span>
          </td>
          <td class="col-md-1">{{book.discount}} %</td>
          <td class="col-md-1">{{(book.price - book.price*book.discount/100).toFixed(2)}} $</td>
             </tr> 

            </table>
        <!-- </div> -->
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
      content: '',
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
        self.content = 'book'
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
      self.filter.type = type
      self.filter.id = id
      self.refreshed = false
      self.content = ''

    },
        logOut: function(){
        var self = this
        self.user = {}
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
                       if(xhr.status == 401){
                        self.user.id = '0'
                        self.user.hash = '0'
                        
                       }
                  } else if(JSON.parse(xhr.responseText) != 'NE ZALOGINEN'){
                    self.user = JSON.parse(xhr.responseText)[0]
                    localStorage['user'] = JSON.stringify({id: self.user.id, hash: self.user.hash})
                    }
                    else{
                        self.user.id = '0'
                        self.user.hash = '0'
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
      self.content = 'cart'

    },
    showOrders: function(){
      var self = this
      self.content = 'orders'
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

/* td{
  padding:20px;
}
th{
  padding:20px;
} */
.logged{
  height: 200px;
}

table{
  margin-top: 40px;
}

.left{
  /* width: 400px; */
  background-color: #f0bd86;
}
.right{
  /* background-color: #f0bc86; */
}


</style>
