<template>
  <div class="add-book">
    <h4>Add Book</h4>
        <div class="row">
        <div class="col-md-5">
          <form>
            <div class="form-group">
              <label for="exampleInputEmail1">Book Title</label>
              <input v-model="title"  type="text" class="form-control" >
            </div>
              <div class="form-group">
                <label>Description</label>
                <textarea v-model="desc"  class="form-control"  rows="3"></textarea>
               </div>
            <div class="input-group">
              <span class="input-group-addon">Price</span>
              <input v-model="price" type="text" class="form-control" >
            </div>
            <div class="input-group">
              <span class="input-group-addon">Discount</span>
              <input v-model="disc" type="text" class="form-control" >
            </div>
         
             <div class="form-group">
                <label >Authors to Add</label>
                <select v-model="selectedAuthors" multiple class="form-control" >
                  <option v-for="author in authors" :value="author.id">{{author.name}}</option>
                </select>
              </div>
         
             <div class="form-group">
                <label >Genres to add</label>
                <select v-model="selectedGenres" multiple class="form-control" >
                  <option v-for="genre in genres" :value="genre.id">{{genre.name}}</option>
                </select>
              </div>
              <button @click="addBook()" type="button" class="btn btn-primary btn-lg btn-block">Add</button>
          </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Book',
  data () {
    return {
      authors:'',
      genres:'',
      selectedAuthors:[],
      selectedGenres:[],
      title:'',
      desc:'',
      price:'',
      disc:'',
      errMsg: '',
      user:{}
    }
  },
  created(){
    this.getUserData()
    this.getGenres()
    this.getAuthors()
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
    addBook: function(){
      var self = this
      if(self.validForm()){
      var xhr = new XMLHttpRequest();
      var json = JSON.stringify({
         book: {
           title: self.title,
           description: self.desc,
           price: self.price,
           discount: self.disc,
         },
        authors:self.selectedAuthors,
        genres:self.selectedGenres,
      });
          xhr.open("POST", getUrl()+'books/', true)
          xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
          xhr.setRequestHeader("Authorization", "Basic " + btoa(self.user.id+":"+self.user.hash));          
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return
                  if (xhr.status != 200) {
                        alert(xhr.status + ': ' + xhr.statusText)
                  } else {
                    var res = JSON.parse(xhr.responseText)
                    if(res === true){
                      self.errMsg = 'Added'
                      self.$router.push({ path: '/admin/'})
                    }else{
                      self.errMsg = res
                    }
                    self.$parent.getBooks()
                  }
            }
          xhr.send(json)
      }
    },
  validForm(){
    var self = this
    self.errMsg = ''
    if(self.selectedAuthors < 1){
      self.errMsg = 'Book must have at least 1 author'
      return false;
    }
    if(self.selectedGenres < 1){
       self.errMsg = 'Book must have at least 1 genre'
      return false; 
    }
    if(!self.title){
       self.errMsg = 'Check Title field'
      return false; 
    }
    if(!self.desc){
       self.errMsg = 'Check Description field'
      return false; 
    }
    if (!self.price){
      self.errMsg = 'Check Price field'
      return false; 
    }
    if(!self.disc){
      self.errMsg = 'Check Discount field'
      return false; 
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
