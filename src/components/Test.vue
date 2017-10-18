<template>
  <div class="test">
    TEST
adasdas
dasdasd
sadsad
sadsaddsadsa
dasdasddsadsa

  </div>
</template>

<script>
export default {
  name: 'Test',
  data () {
    return {

    }
  },
  created(){

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
    test: function(){
      var self = this
      console.log(self.selectedAuthors)
    },
    addBook: function(){
      var self = this
      if(self.validForm()){
      var xhr = new XMLHttpRequest();
      // var authors = []
      // self.selectedAuthors.forEach(function(el) {
      //  authors.push({id:el}) 
      // });
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
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return
                  if (xhr.status != 200) {
                        alert(xhr.status + ': ' + xhr.statusText)
                  } else {
                    console.log(xhr.responseText)
                    // self.msg = JSON.parse(xhr.responseText)
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
