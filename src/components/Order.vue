<template>
  <div class="orders">
    <h4> My Orders:</h4>
    <p>{{msg}}</p>
    <div v-if="orders">
      <table class="table">
        <thead>
      <div class="or-rowhead">      
        <div class="or-cell2">
          Order ID
        </div>
        <div class="or-cell4">
          User discount
        </div>
        <div class="or-cell4">
          Pay Method
        </div>
        <div class="or-cell4">
          Order Status
        </div>
        <div class="or-cell5">
          Order Date
        </div>
        <div class="or-cell4">
          Order Total:
        </div>
        <div class="or-cell4">
          <button @click="dateSort()" class="sort">^</button>
        </div>
      </div>
  </thead>
  <tbody>
      <div v-for="(order, index) in arrayToDraw" :key="order.id" >
          <div @click="show(index)" class="or-row">
            <div class="or-cell2">
              {{order.id}}
            </div>
            <div class="or-cell4">
              {{order.u_disc}}
            </div>
            <div class="or-cell4">
              {{order.p_name}}
            </div>
            <div class="or-cell4">
              {{order.s_name}}
            </div>
            <div class="or-cell5">
              {{order.date}}
            </div>
            <div class="or-cell4">
              {{order.summ}} $
            </div>
            <div  class="or-cell4">
            </div>
        </div>
      <div v-if="order.showSelect == true">
          <div class="or-row">
                <div class="od-cell1">
                  Book Id
                </div>
                <div class="od-cell2">
                  Book Title
                </div>
                <div class="od-cell3">
                  Book count
                </div>
                <div class="od-cell4">
                  Book price
                </div>
                <div class="od-cell5">
                  Book discount
                </div>
                <div class="od-cell5">
                  Sum of position
                </div>
          </div>
          <div v-for="book in order.books" class="od-row">
                <div class="od-cell1">
                  {{book.b_id}}
                </div>
                <div class="od-cell2">
                  {{book.title}}
                </div>
                <div class="od-cell3">
                  {{book.count}}
                </div>
                <div class="od-cell4">
                  {{book.price}}
                </div>
                <div class="od-cell5">
                  {{book.discount}}
                </div>
                <div class="od-cell5">
                  {{((+book.price * +book.count) - ((+book.count * +book.price * +book.discount)/100)).toFixed(2)}}
                </div>

          </div>
                <div class="od-row">
                  <div class="od-cell4">
                    <button  @click="hide(index)" >Hide</button>
                  </div>
                </div>
          </div>
      </div>
  </tbody>
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
      orders:'',
      refreshed: false,
      msg:'',
      sort: true
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
                var res = JSON.parse(xhr.responseText)
                if(!res){
                  self.msg = 'You have no orders yet'
                }
                else{
                  self.orders = JSON.parse(xhr.responseText)
                  self.calculateSumm()
                }

              }
        }
        xhr.send();
    },
      show: function(index){
    var self = this
    var orders = self.orders
    if(!orders[index].showSelect){
    orders[index].showSelect = !orders[index].showSelect
    self.orders = orders
    self.refreshed = false
    }

  },
  hide: function(index){
    var self = this
    var orders = self.orders
    if(orders[index].showSelect){
    orders[index].showSelect = !orders[index].showSelect
    self.orders = orders
    self.refreshed = false
    }
  },
    calculateSumm: function(){
    var self = this
    var orders = self.orders

    orders.forEach(function(order) {
     var summ = 0
      order.books.forEach(function(book){
        summ += (+book.price * +book.count - ((+book.price * +book.count) * +book.discount)/100)
      })
      order.summ = (summ - (summ* order.u_disc) /100).toFixed(2)
    })
    self.orders = orders
  },
    dateSort: function(){
    var self = this
    self.sort = false
    self.refreshed = false
  }
    
  },
  computed:{
    arrayToDraw(){
      var self = this
      var arr = self.orders
      if(!self.refreshed){
        self.refreshed = true
      if(!self.sort){
        arr = arr.reverse()
        }
       }
      return arr
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



ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

.or-row{
  display: table-row;
  padding-top: 10px;
  cursor: pointer;
}
.or-rowhead{
  display: table-row;
  padding-top: 10px;
  padding-bottom: 10px;
}
.or-cell1{
  display: table-cell;
  padding: 5px 10px;
  width: 90px;
}
.or-cell2{
  display: table-cell;
  padding: 5px 10px;
  width: 90px;
}
.or-cell3{
  display: table-cell;
  padding: 5px 10px;
  width: 120px;
}
.or-cell4{
  display: table-cell;
  padding: 5px 5px;
  width: 130px;
}
.or-cell5{
  display: table-cell;
  padding: 5px 5px;
  width: 170px;
}

.or-cell{
  display: table-cell;
  padding: 5px 10px;
}

.orders{
  width: 1100px;
  margin: auto;
}
.od-row{
  display: table-row;
  width:900px;
}
    
.od-cell1{
  display: table-cell;
    padding: 5px 5px;
      width: 120px;
}
.od-cell2{
  display: table-cell;
    padding: 5px 5px;
      width: 120px;
}
.od-cell3{
  display: table-cell;
    padding: 5px 5px;
      width: 120px;
}
.od-cell4{
  display: table-cell;
    padding: 5px 5px;
      width: 120px;
}
.od-cell5{
  display: table-cell;
    padding: 5px 5px;
      width: 120px;
}
</style>
