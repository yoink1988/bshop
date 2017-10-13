<template>
  <div class="books">

  </div>
</template>

<script>
export default {
  name: 'Book',
  // props: ['book'],
  data () {
    return {
      bookId: this.$route.params.id,
      book:[]
    }
  },
  methods:{
    getBook: function(){
      var self = this
        var xhr = new XMLHttpRequest()
        xhr.open('GET', self.requestUrl+'books/'+self.bookId+'/', true)
        xhr.send();
          xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return
              if (xhr.status != 200) {
                    alert(xhr.status + ': ' + xhr.statusText)
              } else {
                self.book = JSON.parse(xhr.responseText)
                log(self.book)
              }
        }
    },
    log: function(data){
      var self = this
      console.log(self.$parent.DATA)
    }
  },
  created(){
    this.log(this.bookId)
    this.getBook()
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
