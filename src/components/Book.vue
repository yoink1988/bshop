<template>
  <div class="books">
    <table>
      <tr><td class="title"><b>Title</b></td>
      <td class="description"><b>Description</b></td>
      <td class="price"><b>Price</b></td>
      <td class="discount"><b>Discount</b></td></tr>
      <tr v-for = "book, key in books">
        <td class="title"><router-link :to="'/books/'+book.id">{{book.title}}</router-link></td>
        <td class="description">{{book.description}}</td>
        <td class="price">{{book.price}} $</td>
        <td class="discount">{{book.discount}} %</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Book',
  props: ['books'],
  data () {
    // return {
      
    // }
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
