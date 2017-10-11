<template>
  <div class="main">
    <div class="row">
      <h2>Book Shop</h2>
      <div class="books-section">
        <book-section :books="books"></book-section>
      </div>
    </div>
  </div>
</template>

<script>
import Book from './Book'
export default {
  name: 'Home',
  data () {
    return {
      books: {}
    }
  },
  created(){
    this.getBooks()
  },
  methods:{
    getBooks: function(){
      var self = this
        var xhr = new XMLHttpRequest()
        xhr.open('GET', 'http://192.168.0.15/~user9/bookShop/client/api/books/', true)
        xhr.send();
          xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return
              if (xhr.status != 200) {
                    alert(xhr.status + ': ' + xhr.statusText)
              } else {
              self.books = JSON.parse(xhr.responseText)
              }
        }
    }
  },
  components:{
    'book-section': Book
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
</style>
