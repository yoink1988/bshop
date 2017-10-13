<template>
  <div class="book">
    <h2>Book Details</h2>
    <div class="info">
      <h4>{{book.title}}</h4>
      <p>{{book.description}}</p>
      <p>Authors: <span v-for="author in book.authors">{{author.name}} </span></p>
      <p>Genres: <span v-for="genre in book.genres">{{genre.name}} </span></p>
      <p>Price: {{book.price}} $</p>
      <!-- <div v-if="user.role != 'guest'" class="add">
        ssss
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'Book',
  // props: ['user'],
  data () {
    return {
      bookId: this.$route.params.id,
      book:[],
      // checkAuth: self.$parent.checkAuth
    }
  },
  methods:{
    getBook: function(){
      var self = this
        var xhr = new XMLHttpRequest()
        xhr.open('GET', self.$parent.requestUrl+'books/'+self.bookId+'/', true)
        xhr.send();
          xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return
              if (xhr.status != 200) {
                    alert(xhr.status + ': ' + xhr.statusText)
              } else {
                self.book = JSON.parse(xhr.responseText)[0]
                // self.log(self.book)
              }
        }
    },
    log: function(data){
      var self = this
       console.log(data)
    }
  },
  created(){
    // this.log(this.bookId)
    // this.checkAuth()
    this.getBook()
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
