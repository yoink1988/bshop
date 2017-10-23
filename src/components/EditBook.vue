<template>
  <div class="edit-book row">
    <h4>Edit Book <b>{{book.title}}</b></h4>
    <div class="row">
    <div class="col-md-5">
          <form>
            <div class="form-group">
              <label for="exampleInputEmail1">Book Title</label>
              <input v-model="book.title" type="text" class="form-control" >
            </div>
              <div class="form-group">
                <label>Description</label>
                <textarea v-model="book.description"  class="form-control"  rows="3"></textarea>
               </div>
            <div class="input-group">
              <span class="input-group-addon">Price</span>
              <input v-model="book.price" type="text" class="form-control" >
            </div>
            <div class="input-group">
              <span class="input-group-addon">Discount</span>
              <input v-model="book.discount" type="text" class="form-control" >
            </div>
            <div class="input-group">
              <span v-if="bookStatus" class="input-group-addon">Active</span>
              <span v-if="!bookStatus" class="input-group-addon"><b>Not Active</b></span>
              <button @click="changeBookStatus()" type="submit" class="btn btn-primary">Change</button>
            </div>          
             <div class="form-group">
                <label >Authors to delete</label>
                <select v-model="authorsToDelete" multiple class="form-control" >
                   <option v-for="author in book.authors" :value="author.id">{{author.name}}</option>
                </select>
              </div>
             <div class="form-group">
                <label >Authors to Add</label>
                <select v-model="authorsToAdd" multiple class="form-control" >
                  <option v-for="author in diff(authors, bookAuthors)" :value="author.id">{{author.name}}</option>
                </select>
              </div>
             <div class="form-group">
                <label >Genres to delete</label>
                <select v-model="genresToDelete" multiple class="form-control" >
                  <option v-for="genre in book.genres" :value="genre.id">{{genre.name}}</option>
                </select>
              </div>
             <div class="form-group">
                <label >Genres to add</label>
                <select v-model="genresToAdd" multiple class="form-control" >
                  <option v-for="genre in diff(genres, bookGenres)" :value="genre.id">{{genre.name}}</option>
                </select>
              </div>
              <button @click="save()" type="button" class="btn btn-primary btn-lg btn-block">Update</button>
          </form>
      </div>
    </div>  
  </div>
</template>

<script>
export default {
  name: 'EditBook',
      beforeRouteUpdate(to, from, next) {
        if(this.getBooks(to.params.id)){
        next()
        }
        // else{
        //   this.$router.push('/admin/')
        // }      // }
    },
  data () {
    return {
      authors:'',
      genres:'',
      book:'',
      msg:'',
      bookGenres:'',
      bookAuthors:'',
      authorsToDelete:[],
      authorsToAdd:[],
      genresToDelete:[],
      genresToAdd:[],
      bookStatus: true,
      user:''
    }
  },
  created(){
    this.getUserData()
    this.getGenres()
    this.getAuthors()
    this.getBooks(this.$route.params.id)
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
                  self.msg = 'Authors not found'
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
                  self.msg = 'Genres not found'
                }
              }
        }
    },
        getBooks: function(id){
        var self = this
        var xhr = new XMLHttpRequest()
        xhr.open('GET', getUrl()+'books/id/'+id+'/status/all', true)
        xhr.send();
          xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return
              if (xhr.status != 200) {
                    alert(xhr.status + ': ' + xhr.statusText)
              } else {
                var res = JSON.parse(xhr.responseText)
                if(res){
                self.book = res[0]
                self.bookGenres = self.book.genres
                self.bookAuthors = self.book.authors
                self.bookStatus = !!+self.book.status
                }
                else{
                  self.$router.push('/admin/')
                }
              }
        }
    },
    diff: function(a, b){

      var q, temp=Object.create(null), res=[]

      for (q=0; q<a.length; ++q)
        temp[a[q].id] = a[q]

      for (q=0; q<b.length; ++q)
        if (b[q].id in temp)
          delete temp[b[q].id]
        else
          temp[b[q].id] = b[q]

      for (q in temp)
        res.push(temp[q])
      return res
    },
    save: function(){
      var self = this
      self.msg = ''
      if(self.validForm()){
        var xhr = new XMLHttpRequest();
        var json = JSON.stringify({
          book:{
            id : self.book.id,
            title : self.book.title,
            description : self.book.description,
            price : self.book.price,
            discount : self.book.discount,
            status : self.bookStatus,
          },
          authToDel: self.authorsToDelete,
          authToAdd: self.authorsToAdd,
          genToDel: self.genresToDelete,
          genToAdd: self.genresToAdd,
        });
            xhr.open("PUT", getUrl()+'books/', true)
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
             xhr.setRequestHeader("Authorization", "Basic " + btoa(self.user.id+":"+self.user.hash));            
              xhr.onreadystatechange = function() {
                  if (xhr.readyState != 4) return
                    if (xhr.status != 200) {
                          alert(xhr.status + ': ' + xhr.statusText)}
                          else {
                            var res = JSON.parse(xhr.responseText)
                            if(res === true){
                              self.$parent.getBooks()
                              self.msg = 'Updated'
                            }else{
                              self.msg = res
                            }
                            self.getBooks(self.book.id)
                    }
              }
            xhr.send(json)
      }

    },
    changeBookStatus: function(){
      var self = this
      self.bookStatus = !self.bookStatus
    },
    validForm: function(){
      var self = this
      if((self.authorsToAdd.length + (self.bookAuthors.length - self.authorsToDelete.length) < 1)){
        self.msg = 'book must have at least 1 author'
        return false
      }
      if((self.genresToAdd.length + (self.bookGenres.length - self.genresToDelete.length) < 1)){
        self.msg = 'book must have at least 1 genre'
        return false
      }
      return true

    }



  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
  /* padding: 30px; */
}

  .book{
  background-color: lemonchiffon;

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

.info{
  width: 40%;
  margin: auto;
}

a {
  color: #42b983;
}
</style>
