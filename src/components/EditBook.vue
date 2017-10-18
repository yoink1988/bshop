<template>
  <div class="add-book">
    <h4>Edit Book</h4>
    <h4>{{book.title}}</h4>
    
      <div class="form">
        <p>Book title: <input v-model="book.title" name="titile" type="text"/></p>
        <p>Decription: <textarea v-model="book.description" name="desc" id="" cols="30" rows="10"></textarea></p>
        <p>Book Price: <input v-model="book.price" pattern="[0-9]+" name="price" type="text"/></p>
        <p>Book discount: <input v-model="book.discount" name="discount" type="text"/></p>
        <p>Book status: <span v-if="book.status">Active</span>
                        <span v-else><b>Not active</b></span>
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
        <p>{{errMsg}}</p>
        <button @click="test_diff()" class="test">TEST</button>
      </div>
  </div>
</template>

<script>
export default {
  name: 'EditBook',
  props: ['idBook'],
  data () {
    return {
      authors:'',
      genres:'',
      book:'',
      errMsg:'',
      bookGenres:'',
      bookAuthors:'',
      authorsToDelete:[],
      authorsToAdd:[],
      genresToDelete:[],
      genresToAdd:[],
    }
  },
  created(){
    this.getGenres()
    this.getAuthors()
    this.getBooks()
    // console.log(this.book.genres)
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
        xhr.open('GET', getUrl()+'books/id/'+self.idBook+'/status/all', true)
        xhr.send();
          xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return
              if (xhr.status != 200) {
                    alert(xhr.status + ': ' + xhr.statusText)
              } else {
                self.book = JSON.parse(xhr.responseText)[0]
                self.bookGenres = self.book.genres
                self.bookAuthors = self.book.authors
                // console.log(self.bookGenres)
              }
        }
    },
    test: function(){
      var self = this
      console.log(self.selectedAuthors)
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
      self.errMsg = ''
      // console.log(self.book.title)
      // console.log(self.book.description)
      // console.log(self.book.price)
      // console.log(self.book.discount)
      // console.log(self.book.status)
      // console.log(self.authorsToDelete)
      console.log(self.authorsToAdd)
      // console.log(self.genresToDelete)
      // console.log(self.genresToAdd)
      // console.log(self.genresToAdd.length)

      if(self.validForm()){

        var xhr = new XMLHttpRequest();
        var json = JSON.stringify({
          book:{
            id : self.book.id,
            title : self.book.title,
            description : self.book.description,
            price : self.book.price,
            discount : self.book.discount,
            status : self.book.status,
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
                          console.log(xhr.responseText)
                        // self.authMsg = JSON.parse(xhr.responseText)
                    }
              }
            xhr.send(json)
      }

    },
    changeBookStatus: function(){
      var self = this
      self.book.status = !self.book.status
      console.log(self.book.status)
    },
    validForm: function(){
      var self = this
      if((self.authorsToAdd.length + (self.bookAuthors.length - self.authorsToDelete.length) < 1)){
        self.errMsg = 'book must have at least 1 author'
        return false
      }
      if((self.genresToAdd.length + (self.bookGenres.length - self.genresToDelete.length) < 1)){
        self.errMsg = 'book must have at least 1 genre'
        return false
      }
      return true

    }



  }

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
