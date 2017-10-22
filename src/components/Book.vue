<template>
  <div class="book">
    <h3>Book Details</h3>
    <div class="info">
      <h4>{{book.title}}</h4>
      <p>{{book.description}}</p>
      <p>Authors: <span v-for="author in book.authors">{{author.name}} </span></p>
      <p>Genres: <span v-for="genre in book.genres">{{genre.name}} </span></p>
      <p>Price: {{book.price}} $</p>
      <div v-if="user.role != 'guest'" class="add">
        Count: <input v-model="count" type="text">
        <button @click="addToCart()" class="add-to-cart">Add to Cart</button>
        <p>{{msg}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Book',
  props: ['book', 'user'],
  data () {
    return {
      count: 1,
      msg: ''
    }
  },
  created(){
    // console.log(this.user.role)
  },
  methods:{
    addToCart: function(){
      var self = this

      var xhr = new XMLHttpRequest();
      var json = JSON.stringify({
         id_user: self.user.id,
         id_book: self.book.id,
         count: self.count
      });

          xhr.open("POST", getUrl()+'cart/', true)
          xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return
                  if (xhr.status != 200) {
                        alert(xhr.status + ': ' + xhr.statusText)
                  } else {
                    var res = JSON.parse(xhr.responseText)
                    if(!res){
                      self.msg = 'Count must me a positive Integer'
                    }
                    else{
                      self.msg = res
                    }
                  }
            }
          xhr.send(json)
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
