<template>
  <div class="admin-home">
    
        <div class="row">
      <div class="col-md-3 left">
        <router-link to="/">Home</router-link>
        <div class="authors">
          Authors:
          <div class="new-author">
            Author name:<input type="text" v-model="newAuth">
            <button @click="addAuthor()" class="add-auth btnn">Add</button>
          </div>
          <div class="edit">
            Edit or delete:<select v-model="editAuth" class="authors">
              <option value="" class="default">Select Author</option>
              <option v-for="(author, index) in authors" :value="author.id">{{author.name}}</option>
            </select>
            <div v-if="editAuth" class="ed-a">
              New name:<input type="text" v-model="editAuthName" >
              <button @click="renameAuthor()" class="del-auth btnn">Rename</button>
              <button @click="deleteAuthor()" class="del-auth btnn">Delete</button>
            </div>
          </div>
          <div class="auth-msg">
            {{authMsg}}
          </div>
        </div>

      <div class="genres">
        Genres:
          <div class="new-genre">
            Genre name:<input type="text" v-model="newGenre">
            <button @click="addGenre()" class="add-genre btnn">Add</button>
          </div>
          <div class="edit">
          Edit or delete:<select v-model="editGenre" class="genres">
            <option value="" class="default">Select Genre</option>
            <option v-for="genre in genres" :value="genre.id">{{genre.name}}</option>
          </select>
          <div v-if="editGenre" class="ed-g">
            New name:<input type="text" v-model="editGenreName">
            <button @click="renameGenre()" class="del-genre btnn">Rename</button>
            <button @click="deleteGenre()" class="del-genre btnn">Delete</button>
          </div>
        </div>
        <div class="genre-msg">
          {{genreMsg}}
        </div>
        </div>  

      <div class="books">
        Books:
        <div>
          <router-link to="/admin/addbook/"><button class="add-user btnn">Add Book</button></router-link>
        </div>
          <p><select v-model="editBook" class="books">
            <option value="" class="default">Select Book</option>
            <option v-for="book in books" :value="book.id">{{book.title}}</option>
          </select> 
          <button class="btnn" @click="showEditBook()" >Edit</button>

          </p>
          <div class="book-msg">
            {{bookMsg}}
          </div>
      </div>

      <div class="users">
        Users:
        <div class="new-user">
          <router-link to="/admin/adduser/"><button class="add-user btnn">Add User</button></router-link>
        </div>
        <div class="edit">
          <select v-model="editUser" name="" id="" class="sel-users">
          <option value="" class="default">Select User</option>
          <option v-for="user in users" :value="user.id" >{{user.name}}</option>
          </select>
          <button @click="showEditUserDetails()" class="edit-user btnn">Edit User</button>
        </div>

      </div>

      <div class="orders">

          <button @click="showOrders()" class="view-orders btnn">View Orders</button>

      </div>

     
      </div>
      <div class="col-md-9 right " >
        <h2 style="text-align:center">Admin bookshop</h2>
        <div class="row" style="margin:40px">
        <router-view></router-view>
      </div>
      </div>

      </div>

      </div>
    </div>
  </div>
</template>

<script>
import AdminOrders from './AdminOrders'
import AddBook from './AddBook'
import EditBook from './EditBook'
import Register from './Register'
import EditUser from './EditUser'
export default {
  name: 'Admin',
  data () {
    return {
      user:{},
      authors:'',
      genres:'',
      books:'',
      users:'',
      orders:'',
      newAuth:'',
      editAuth:'',
      newGenre:'',
      editGenre:'',
      editAuthName:'',
      editGenreName:'',
      authMsg:'',
      genreMsg:'',
      bookMsg:'',
      errMsg:'',
      content:'',
      editUser:'',
      editBook:'',
    }
  },
  created(){
    this.getUserData()

    this.getAuthors()
    this.getGenres()
    this.getBooks()
    this.getUsers()

  },
  methods:{
      checkAuth: function(){
      var self = this
      var xhr = new XMLHttpRequest();
          xhr.open("GET", getUrl()+'auth/', true)
          xhr.setRequestHeader("Authorization", "Basic " + btoa(self.user.id+":"+self.user.hash));
          xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return
                  if (xhr.status != 200) {
                  } else{
                   var res = JSON.parse(xhr.responseText)
                   if(!res){
                    self.user.name = ''
                    self.user.role = 'guest'
                    self.user.id = '0'
                    self.user.hash = '0'
                   }
                   else{
                     self.getUserInfo()
                   }
                  }
            }
          xhr.send()        
      },
      getUserInfo: function(){
      var self = this
      var xhr = new XMLHttpRequest();
          xhr.open("GET", getUrl()+'users/'+self.user.id, true)
          xhr.setRequestHeader("Authorization", "Basic " + btoa(self.user.id+":"+self.user.hash));
          xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return
                  if (xhr.status != 200) {
                  } else{
                   var res = JSON.parse(xhr.responseText)
                   if(!res){
                    self.user.name = ''
                    self.user.role = 'guest'
                    self.user.id = '0'
                    self.user.hash = '0'
                   }
                   else{
                    self.user = res[0]
                    self.checkRole()
                   }
                  }
            }
          xhr.send()  
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
        self.checkAuth()
      },
    checkRole: function(){
      var self = this
      if(self.user.role != 'admin')
      {
        self.$router.push('/')
      }
  },
    test: function(){
      var self = this
      self.$parent.testik()
    },
    getAuthors: function(){
      var self = this
        var xhr = new XMLHttpRequest()
        xhr.open('GET', getUrl()+'authors/', true)
        xhr.send();
          xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return
              if (xhr.status != 200) {
                    alert(xhr.status + ': ' + xhr.statusText)
              } else {
                  var res = JSON.parse(xhr.responseText)
                if(res){
                  self.authors = res
                }else{
                  self.errMsg = 'Authors not found'
                }
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
                  var res = JSON.parse(xhr.responseText)
                if(res){
                  self.genres = res
                }else{
                  self.errMsg = 'Genres not found'
                }
              }
        }
    },
    getBooks: function(){
      var self = this
        var xhr = new XMLHttpRequest()
        xhr.open('GET', getUrl()+'books/status/all', true)
        xhr.send();
          xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return
              if (xhr.status != 200) {
                    alert(xhr.status + ': ' + xhr.statusText)
              } else {
                var res = JSON.parse(xhr.responseText)
                if(res){
                  self.books = res
                }else{
                  self.errMsg = 'Books not found'
                }
              }
        }
    },
    addAuthor:function(){
      var self = this
      if(self.newAuth){
      self.authMsg = ''
      var xhr = new XMLHttpRequest();
      var json = JSON.stringify({'name':self.newAuth});
          xhr.open("POST", getUrl()+'authors/', true)
          xhr.setRequestHeader("Authorization", "Basic " + btoa(self.user.id+":"+self.user.hash));          
          xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return
                  if (xhr.status != 200) {
                        alert(xhr.status + ': ' + xhr.statusText)
                  } else {
                    var res = JSON.parse(xhr.responseText) 
                    if(!res){
                      self.authMsg = 'Check Name field'
                    }
                    else{
                      self.authMsg = 'Added'
                      self.newAuth = ''
                    }
                    self.getAuthors()
                  }
            }
          xhr.send(json)
      }
      else{
        self.authMsg = 'Check Name field'
      }
    },
    renameAuthor: function(){
      var self = this
      self.authMsg = ''
      if(self.editAuthName){
        var xhr = new XMLHttpRequest();
        var json = JSON.stringify({
          'id':self.editAuth,
          'name':self.editAuthName
        });
            xhr.open("PUT", getUrl()+'authors/', true)
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.setRequestHeader("Authorization", "Basic " + btoa(self.user.id+":"+self.user.hash));             
              xhr.onreadystatechange = function() {
                  if (xhr.readyState != 4) return
                    if (xhr.status != 200) {
                          alert(xhr.status + ': ' + xhr.statusText)}
                          else {
                            var res = JSON.parse(xhr.responseText)
                        if(res){
                          self.authMsg = 'Updated'
                          self.editAuth = ''
                          self.editAuthName = ''
                        }else{
                          self.authMsg = 'Check Name field'
                        }
                        self.getAuthors()
                    }
              }
            xhr.send(json)
              }
      else{
        self.authMsg = 'Check name field'
      }
    },
    deleteAuthor: function(){
      var self = this
      self.authMsg = ''
      if(self.editAuth){
        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", getUrl()+'authors/id/'+self.editAuth, true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
          xhr.setRequestHeader("Authorization", "Basic " + btoa(self.user.id+":"+self.user.hash));         
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return
                  if (xhr.status != 200) {
                        alert(xhr.status + ': ' + xhr.statusText)
                  } else {
                      var res = JSON.parse(xhr.responseText)
                      if(res){
                        self.authMsg = 'Deleted'
                      }
                      else{
                        self.authMsg = 'Fail'
                      }
                        self.getAuthors()
                        self.editAuth = ''
                        self.editAuthName = ''
                  }
          }
          xhr.send(null);     
        }
        else{
            self.authMsg = 'Select an Author'      
        }
    },
    addGenre:function(){
      var self = this
      if(self.newGenre){
      self.genreMsg = ''
      var xhr = new XMLHttpRequest();
      var json = JSON.stringify({'name':self.newGenre});
          xhr.open("POST", getUrl()+'genres/', true)
          xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
          xhr.setRequestHeader("Authorization", "Basic " + btoa(self.user.id+":"+self.user.hash));           
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return
                  if (xhr.status != 200) {
                        alert(xhr.status + ': ' + xhr.statusText)
                  } else {
                    var res = JSON.parse(xhr.responseText)
                    if(res){
                      self.genreMsg = 'Added'
                      self.newGenre = ''
                      self.getGenres()
                    }else{
                      self.genreMsg = 'Check Name field'
                    }
                  }
            }
          xhr.send(json)
      }
      else{
        self.genreMsg = 'Check name field'
      }
    },
    renameGenre: function(){
      var self = this
      self.genreMsg = ''
      if(self.editGenreName && self.editGenre){
        var xhr = new XMLHttpRequest();
        var json = JSON.stringify({
          'id':self.editGenre,
          'name':self.editGenreName
        });
            xhr.open("PUT", getUrl()+'genres/', true)
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.setRequestHeader("Authorization", "Basic " + btoa(self.user.id+":"+self.user.hash));             
              xhr.onreadystatechange = function() {
                  if (xhr.readyState != 4) return
                    if (xhr.status != 200) {
                          alert(xhr.status + ': ' + xhr.statusText)}
                          else {
                            var res = JSON.parse(xhr.responseText)
                            if(res){
                              self.genreMsg = 'Updated'
                              self.editGenre = ''
                              self.editGenreName = ''
                              self.getGenres()
                            }else{
                              self.genreMsg = 'Check Name field'
                            }
                    }
              }
            xhr.send(json)
              }
      else{
        self.genreMsg = 'Check name field'
      }
    },
    deleteGenre: function(){
      var self = this
      self.genreMsg = ''
      if(self.editGenre){
        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", getUrl()+'genres/id/'+self.editGenre, true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.setRequestHeader("Authorization", "Basic " + btoa(self.user.id+":"+self.user.hash));         
            xhr.onreadystatechange = function() {
              if (xhr.readyState != 4) return
                  if (xhr.status != 200) {
                        alert(xhr.status + ': ' + xhr.statusText)
                  } else {
                    var res = JSON.parse(xhr.responseText)
                    if(res){
                        self.genreMsg = 'Deleted'
                        self.editGenre = ''
                        self.editGenreName = ''                        
                        self.getGenres()
                    }else{
                        self.genreMsg = 'Check Name field'
                    }
                  }
          }
          xhr.send(null);     
        }
        else{
            self.genreMsg = 'Select a Genre'      
        }
    },
    getUsers: function(){
       var self = this
        var xhr = new XMLHttpRequest()
        xhr.open('GET', getUrl()+'users/', true)

          xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return
              if (xhr.status != 200) {
                    alert(xhr.status + ': ' + xhr.statusText)
              } else {
                var res = JSON.parse(xhr.responseText)
                if(!res){
                  self.errMsg = 'Not found'
                }
                else{
                  self.users = res
                  }
              }
        } 
      xhr.send();    
    },
    showOrders: function(){
      var self = this
        self.$router.push({ path: '/admin/orders/'})
    },
    showAddBook: function(){
      var self = this
      self.content = 'addBook'
    },
    showEditUserDetails: function(){
      var self = this
      if(self.editUser){
        self.$router.push({ path: '/admin/edituser/'+self.editUser})
      }
      else{
        self.$router.push({ path: '/admin/'})
      }  
    },
    showEditBook: function(){
      var self = this
      if(self.editBook){
        self.$router.push({ path: '/admin/editbook/'+self.editBook})
      }
      else{
        self.$router.push({ path: '/admin/'})
      }      
    }

  },


  computed:{
    getBookToEdit(){
      var self = this
      if(self.EditBook){
        var book = []
        var id = self.EditBook
        self.books.forEach(function(el) {
          if(el.id == id){
            book.push(el)
          }
        });
        return book
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

td{
  padding:10px;
}

th{
  padding:20px;
}

table{
  margin-top: 40px;
}

.left div{
  padding-top:15px;
}

a {
  color: #42b983;
}

.left{
  background-color: #fce3c7;
  padding: 30px;
}

.btnn{
  height: 30px;
  background:#FFDCA8;
  color:black;
}
</style>
