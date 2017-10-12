<template>
  <div class="books">
    <!-- <table>
      <tr><td class="title"><b>Title</b></td>
      <td class="description"><b>Description</b></td>
      <td class="price"><b>Price</b></td>
      <td class="price"><b>Authors</b></td>
      <td class="price"><b>Genres</b></td>
      <td class="discount"><b>Discount</b></td>
      <td class="discount"><b>Discounted price</b></td></tr> -->
      <!-- <tr v-for = "book, key in books">
        <td class="title"><router-link :to="'/books/'+book.id">{{book.title}}</router-link></td>
        <td class="description">{{book.description}}</td>
        <td class="price">{{book.price}} $</td>
        <td>
          <p v-for = "author in book.authors"><a  href="#" @click="aler(author.id)" >{{author.name}}</a></p>
        </td>
        <td>
          <p v-for = "genre in book.genres"><router-link :to="'/books/genre/'+genre.id" >{{genre.name}}   </router-link> </p>
        </td>
        <td class="discount">{{book.discount}} %</td>
        <td class="discounted">{{(book.price - book.price*book.discount/100).toFixed(2)}} $</td>
      </tr>
    </table> -->
  </div>
</template>

<script>
export default {
  name: 'Book',
  props: ['books'],
  data () {
    return {
      
    }
  },
  methods:{
    aler: function(author){
      alert(author)
    }
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

td{
  padding:20px;
}
th{
  padding:20px;
}

table{
  margin-top: 40px;
}


.description{
  width: 10%;
}

a {
  color: #42b983;
}
</style>
