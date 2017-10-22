<template>
  <div class="edit-book">
    <h4>Edit Book</h4>
    <h4>{{book.title}}</h4>
    
      <div class="form">
        <p>Book title: <input v-model="book.title" name="titile" type="text"/></p>
        <p>Decription: <textarea v-model="book.description" name="desc" id="" cols="30" rows="10"></textarea></p>
        <p>Book Price: <input v-model="book.price" pattern="[0-9]+" name="price" type="text"/></p>
        <p>Book discount: <input v-model="book.discount" name="discount" type="text"/></p>
        <p>Book status: <span v-if="bookStatus">Active</span>
                        <span v-if="!bookStatus"><b>Not active</b></span>
        <button @click="changeBookStatus()">Change</button></p>
        <!-- <p>Book status: <input v-model="book.status" name="status" type="text"/><button @click="changeStatus()">Change</button></p> -->
        <p>Remove Authors: <select v-model="authorsToDelete" multiple size="5" name="" id="">
                            <option v-for="author in book.authors" :value="author.id">{{author.name}}</option>
                            </select></p>
        <p>Remove Genres: <select v-model="genresToDelete" multiple size="5" name="" id="">
                            <option v-for="genre in book.genres" :value="genre.id">{{genre.name}}</option>
                            </select></p>
        <p>Add Authors: <select v-model="authorsToAdd" multiple size="5" name="" id="">
                            <option v-for="author in diff(authors, bookAuthors)" :value="author.id">{{author.name}}</option>
                            </select></p>
        <p>Add Genres: <select v-model="genresToAdd" multiple size="5" name="" id="">
                            <option v-for="genre in diff(genres, bookGenres)" :value="genre.id">{{genre.name}}</option>
                            </select></p>

        <p><button @click="save()" class="test">Save</button></p>
        <p>{{msg}}</p>
        <!-- <button @click="test()" class="test">TEST</button> -->
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
        // }
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
      bookStatus: true
    }
  },
  created(){
    this.getGenres()
    this.getAuthors()
    this.getBooks(this.$route.params.id)
  },
  methods:{
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
    test: function(){
      var self = this
      console.log(self.$root)
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
      console.log(self.bookStatus)
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

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
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
