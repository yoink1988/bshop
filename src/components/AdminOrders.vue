<template>
  <div v-if="orders" class="orders">
      <div class="or-rowhead">      
        <div class="or-cell2">
          Order ID
        </div>
        <div class="or-cell2">
          User Id
        </div>
        <div class="or-cell3">
          User name
        </div>
        <div class="or-cell4">
          User login
        </div>
        <div class="or-cell3">
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
        </div>
        <button @click="dateSort()" class="sort">^</button>
      </div>

  <div v-for="(order, index) in arrayToDraw" :key="order.id" >
      <div @click="show(index)" class="or-row">
         <div class="or-cell2">
          {{order.id}}
        </div>
        <div class="or-cell2">
          {{order.u_id}}
        </div>
        <div class="or-cell3">
          {{order.u_name}}
        </div>
        <div class="or-cell4">
          {{order.u_login}}
        </div>
        <div class="or-cell2">
          {{order.u_disc}}
        </div>
        <div class="or-cell4">
          {{order.p_name}}
        </div>
        <div v-if="order.showSelect == false" class="or-cell4">
          {{order.s_name}}
        </div>
        <div v-if="order.showSelect == true" class="or-cell4">
          <select v-model="order.s_id">
            <option :value="order.s_id">{{order.s_name}}</option>
            <option v-for="status in order.stat" :value="status.id">{{status.name}}</option>
          </select>
        </div>
        <div class="or-cell5">
          {{order.date}}
        </div>
        <div class="or-cell4">
          {{order.summ}} $
        </div>
        <div v-if="order.showSelect == true" class="or-cell4">
          <button @click="save(index)  " class="save">Save</button>
        </div>
        <div v-if="order.showSelect == false" class="or-cell4">
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
</div>
</template>

<script>
export default {
  name: 'Orders',
  data () {
    return {
      orders:'',
      statuses:'',
      refreshed: false,
      sort: true
    }
  },
  created(){
    this.getStatuses()
    this.getOrders()
  },
  methods:{
    getOrders: function(){
        var self = this
        var xhr = new XMLHttpRequest()
        xhr.open('GET', getUrl()+'orders/', true)
          xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return
              if (xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText)
              } else {
                // console.log(JSON.parse(xhr.responseText))
                var res = JSON.parse(xhr.responseText)
                if(typeof(res) == 'string'){
                  self.msg = res
                }
                else{
                  self.orders = JSON.parse(xhr.responseText)
                  self.calculateSumm()
                  self.addSatusSelect()
                }

              }
        }
        xhr.send();
    },
    getStatuses: function(){
        var self = this
        var xhr = new XMLHttpRequest()
        xhr.open('GET', getUrl()+'status/', true)
          xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return
              if (xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText)
              } else {
                // console.log(JSON.parse(xhr.responseText))
                var res = JSON.parse(xhr.responseText)
                if(typeof(res) == 'string'){
                  self.msg = res
                }
                else{
                  self.statuses = JSON.parse(xhr.responseText)

                }

              }
        }
        xhr.send();
    },
  showOrderDetails:function(order){
    var self = this
    self.OrderToView = order
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
  addSatusSelect: function(){
    var self = this
    var orders = self.orders
    var stat = self.statuses

    orders.forEach(function(order){
      order.showSelect = false
     
      order.stat = stat.slice()
      order.stat.forEach(function(el, key){
        if(el.id == order.s_id){
          order.stat.splice(key, 1)
          order.newStatus = ''
        }
      })
      // order.stat.unshift({'id': order.s_id, 'name': order.s_name})
    })
    self.orders = orders
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


  save: function(index){
    var self = this
    var data = []
        var xhr = new XMLHttpRequest();
        var json = JSON.stringify({id:self.orders[index].id, id_status:self.orders[index].s_id});
            xhr.open("PUT", getUrl()+'orders/', true)
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
              xhr.onreadystatechange = function() {
                  if (xhr.readyState != 4) return
                    if (xhr.status != 200) {
                          alert(xhr.status + ': ' + xhr.statusText)}
                          else {
                            console.log(xhr.responseText)
                            self.getOrders()
                    }
              }
            xhr.send(json)

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
  text-decoration: none;
}

.or-tbl{
  display: table;
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

/* .sort{
  height: 20px;;
} */

</style>
