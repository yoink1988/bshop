<template>
  <div class="orders">
    <table v-if="orders" class="order-table">
      <tr><td>id</td><td>Payment</td><td>Status</td><td>Date</td></tr>
      <tr v-for="order in orders">
        <td>{{order.id}}</td>
        <td>{{order.p_name}}</td>
        <td>{{order.s_name}}</td>
        <td>{{order.date}}</td>
      </tr>
    </table>
  </div>

  </div>
</template>

<script>
export default {
  name: 'Cart',
  props: ['user'],
  data () {
    return {
      orders:''
    }
  },
  created(){
    this.getOrders()
  },
  methods:{
    getOrders: function(){
        var self = this
        var xhr = new XMLHttpRequest()
        xhr.open('GET', getUrl()+'orders/'+self.user.id, true)
          xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return
              if (xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText)
              } else {
                console.log(JSON.parse(xhr.responseText))
                var res = JSON.parse(xhr.responseText)
                if(typeof(res) == 'string'){
                  self.msg = res
                  self.booksInCart =''
                }
                else{
                  self.orders = JSON.parse(xhr.responseText)
                }

              }
        }
        xhr.send();
    },

    
  },
  computed:{

  }
  
  



}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
  /* padding: 30px; */
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
  padding:10px;
}

th{
  padding:20px;
}

table{
  margin-top: 40px;
}


.cart .save-msg{
  text-align: left;
}

a {
  color: #42b983;
}

.trow{
  display:table-row;
}

.tcol{
  display: table-cell;
  padding: 5px;
}

.tbl{
  display: table;
}
</style>
