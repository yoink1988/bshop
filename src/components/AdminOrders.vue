<template>
  <div class="orders">
    <div class="or-tbl">

      <div class="or-rowhead">      
        <div class="or-cell">
          Order ID
        </div>
        <div class="or-cell">
          User Id
        </div>
        <div class="or-cell">
          User name
        </div>
        <div class="or-cell">
          User login
        </div>
        <div class="or-cell">
          User discount
        </div>
        <div class="or-cell">
          Pay Method
        </div>
        <div class="or-cell">
          Order Status
        </div>
        <div class="or-cell">
          Order Date
        </div>
        <div class="or-cell">
          
        </div>
      </div>

      <div  @click="showOrderDetails(order)" v-for="(order, index) in orders" :key="order.id" class="or-row">
         <div class="or-cell">
          {{order.id}}
        </div>
        <div class="or-cell">
          {{order.u_id}}
        </div>
        <div class="or-cell">
          {{order.u_name}}
        </div>
        <div class="or-cell">
          {{order.u_login}}
        </div>
        <div class="or-cell">
          {{order.u_disc}}
        </div>
        <div class="or-cell">
          {{order.p_name}}
        </div>
        <div v-if="!activeOrder" class="or-cell">
          {{order.s_name}}
        </div>
        <div v-if="activeOrder" class="or-cell">
          <select v-model="orders[index].s_name">
            <option v-for="status in statuses" :value="status.id">{{status.name}}</option>
          </select>          
        </div>
        <div class="or-cell">
          {{order.date}}
        </div>
        <div v-if="changedStatus" class="or-cell">
          sssss
        </div>
      </div>

      <div v-if="OrderToView" class="or-row">
        <!-- <div class="od-tbl"> -->
          <!-- <div class="od-rowhead"> -->
            <div class="od-cell">
              Book Id
            </div>
            <div class="od-cell">
              Book Title
            </div>
            <div class="od-cell">
              Book count
            </div>
            <div class="od-cell">
              Book price
            </div>
            <div class="od-cell">
              Book discount
            </div>
          </div>

          <div v-for="book in OrderToView.books" class="od-row">
            <div class="od-cell">
              {{book.b_id}}
            </div>
            <div class="od-cell">
              {{book.title}}
            </div>
            <div class="od-cell">
              {{book.count}}
            </div>
            <div class="od-cell">
              {{book.price}}
            </div>
            <div class="od-cell">
              {{book.discount}}
            </div>
          </div>

        <!-- </div> -->
    

    </div>

    <button @click="test()">TEST</button>
  </div>
  </div>

</template>

<script>
export default {
  name: 'Orders',
  // props: [''],
  data () {
    return {
      orders:'',
      statuses:'',
      changedStatus:'',
      OrderToView:'',
      activeOrder: ''
    }
  },
  created(){
    this.getOrders()
    this.getStatuses()
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
                console.log(JSON.parse(xhr.responseText))
                var res = JSON.parse(xhr.responseText)
                if(typeof(res) == 'string'){
                  self.msg = res
                }
                else{
                  self.orders = JSON.parse(xhr.responseText)
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
                console.log(JSON.parse(xhr.responseText))
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
  test:function(){
    var self = this
    self.activeOrder = !self.activeOrder
  }
    
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
.or-cell{
  display: table-cell;
  padding: 5px 10px;
}

.od-tbl{
  display: table;
}
  
.od-rowhead{
  display: table-row;
}
.od-row{
  display: table-row;
}
    
.od-cell{
  display: table-cell;
}

</style>
