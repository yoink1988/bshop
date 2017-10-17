<template>
  <div class="cart">
    <div v-if="showCart" class="cartt">
    <h4>Cart</h4>

    <div v-if="thankYou !=''" class="thanks">
      <h4>qweqweqwewqeqweqw</h4>
    </div>
    <div v-else></div>

    <div v-if="booksInCart">
      <span>Your discount: {{user.discount}} %</span>
      <table>
        <tr><td style="width:50px">Remove</td><td>Title</td><td>Count</td><td>Price</td><td>Discount</td><td>Actual Price</td><td>Summary</td></tr>
        <tr v-for="(book, index) in booksInCart" :key="book.id">
          <td>
            <input type="checkbox" v-model="booksInCart[index].checkbox"  name="" id="">
          </td>
          <td>
            {{book.title}}
          </td>
          <td>
            <button @click="plus(index)" class="plus">+</button>
            <input v-model="booksInCart[index].count" type="text" :value="book.count" size="3" class="count"> 
            <button @click="minus(index)" class="minus">-</button>
          </td>
          <td>
            {{book.price}} $
          </td>
          <td>
            {{book.discount}} %
          </td>
          <td v-if="Math.sign(book.count) === 1">
            {{((book.price) - (book.price * (book.discount))/100).toFixed(2)}} $
          </td>
          <td v-else>
            -
          </td>
          <td v-if="Math.sign(book.count) === 1">
            {{((book.price*book.count) - (book.price * book.discount)/100).toFixed(2)}} $
          </td>
          <td v-else>
            -
          </td>

        </tr>
        <tr><td>{{saveMsg}}</td><td><button @click="refresh()" class="save">Refresh</button></td></tr>
        <tr><td>Total price:{{totalPrice}} $</td></tr>
        <tr><td>Total price with your discount:{{totalWithUserDiscount }} $</td><td><button @click="goCheckOut()" class="checkout">Check out</button></td></tr>
      </table>

    </div>
    <div v-else>
      {{msg}}
    </div>
   </div>

   <div style="width:500px;margin:auto"  v-if="showCheckOut" class="checkout">
     <h4>CheckOut</h4>
     <!-- <form action=""> -->
     <div style="text-align:left;" class="inp" v-for="(payMeth, index) in payment" :key="payMeth.id">
        <input v-model="checkedPayment" name="id_payment" :value="payMeth.id" type="radio">{{payMeth.name}}</input>
     </div>
      <!-- </form> -->
      
     <button @click="addOrder()" class="back">Add Order</button>
     <button @click="goCart()" class="back">Back to Cart</button>
  
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cart',
  props: ['user'],
  data () {
    return {
      thankYou: '',
      checkedPayment: '',
      showCheckOut: false,
      showCart:true,
      saveMsg: '',
      msg: '',
      booksInCart:'',
      payment:'',
      // ordered:false
    }
  },
  created(){
    // console.log(this.user.role)
    this.getBooksFromCart()
    this.getPayment()
  },
  methods:{
    getBooksFromCart: function(){
        var self = this
        var xhr = new XMLHttpRequest()
        xhr.open('GET', getUrl()+'cart/'+self.user.id, true)
          xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return
              if (xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText)
              } else {
                var res = JSON.parse(xhr.responseText)
                if(typeof(res) == 'string'){
                  self.msg = res
                  self.booksInCart =''
                }
                else{
                  res.forEach(function(el){
                    el.checkbox = false
                  })
                  self.booksInCart = res
                  // console.log(self.booksInCart)
                }
              }
        }
        xhr.send();
    },
    plus: function(index){
      var self = this
      self.booksInCart[index].count++
    },
    minus: function(index){
      var self = this
      if(self.booksInCart[index].count > 1)
      {
        self.booksInCart[index].count--
      }
    },
    refresh: function(){
      var self = this
      self.saveMsg = ''
      var books = self.booksInCart
      var err = false
      books.forEach(function(el){
        if(+el.count < 1 || isNaN(+el.count) ){
          err = true
        }
      })
      if(!err){
        var data = []
        books.forEach(function(el){
          data.push({'id_book':el.id, 'count':el.count, 'checkbox':el.checkbox})
        })      
        data.unshift({'id_user': self.user.id}) 
        var xhr = new XMLHttpRequest();
        var json = JSON.stringify(data);
            xhr.open("PUT", getUrl()+'cart/', true)
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
              xhr.onreadystatechange = function() {
                  if (xhr.readyState != 4) return
                    if (xhr.status != 200) {
                          alert(xhr.status + ': ' + xhr.statusText)}
                          else {
                            // console.log(xhr.responseText)
                       self.saveMsg = JSON.parse(xhr.responseText)
                      self.getBooksFromCart()
                    }
              }
            xhr.send(json)
      }


      else{
        self.getBooksFromCart()
        self.saveMsg = 'Count must be a positive integer'
      }
    },
    goCheckOut: function(){
      var self = this
      self.showCart = false
      self.showCheckOut = true
      self.getPayment()
    },
    getPayment: function(){
        var self = this
        var xhr = new XMLHttpRequest()
        xhr.open('GET', getUrl()+'payment/', true)
          xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return
              if (xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText)
              } else {
                // console.log(xhr.responseText)
                var res = JSON.parse(xhr.responseText)
                if(typeof(res) == 'string'){
                  self.msg = res
                }
                else{
                    res.forEach(function(el){
                    el.checked = false
                  })
                  self.payment = res
                  console.log(self.payment)
                }
              }
        }
        xhr.send();
    },
    goCart: function(){
      var self = this
      self.showCart = true
      self.showCheckOut = false      
    },
    addOrder:function(){
      var self = this
      var books = self.booksInCart
      var payment = self.checkedPayment
      if(payment){
        var order = [{'id_user':self.user.id, 'id_payment':payment, 'disc_user':self.user.discount}]
        var orderInfo = []
        // var data
        books.forEach(function(el){
        orderInfo.push({'id_book':el.id, 'count': el.count, 'price':el.price, 'disc_book':el.discount})
        })
        order.push(orderInfo)
     var xhr = new XMLHttpRequest();
      var json = JSON.stringify(order);

          xhr.open("POST", getUrl()+'orders/', true)
          xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return
                  if (xhr.status != 200) {
                        alert(xhr.status + ': ' + xhr.statusText)
                  } else {

                    console.log(xhr.responseText)
                    self.clearCart()

                    self.showCheckOut = false
                    // self.msg = JSON.parse(xhr.responseText)
                    // self.count = ''
                  }
            }
          xhr.send(json)
      }
    },
    clearCart:function(){
      var self = this
        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", getUrl()+'cart/id/'+self.user.id, true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return
                  if (xhr.status != 200) {
                        alert(xhr.status + ': ' + xhr.statusText)
                  } else {
                    if(JSON.parse(xhr.responseText) == 'Cleared'){
                       self.showCart = false
                      self.$parent.ordered = true
                    }
                  }
        }
        xhr.send(null);
    }
    
  },
  computed:{
    totalPrice(){
      var self = this
      var total = 0
      var books = self.booksInCart
      books.forEach(function(element) {
        if(Math.sign(element.count) === 1){
          total += ((+element.price * +element.count) - ((+element.price * +element.discount)/100))
        }
        else{
          total = '-'
          return
        }
      }, books);
      if(typeof(total) == 'string')
      {
        return total = '-'
      }
      return total.toFixed(2)
    },
    totalWithUserDiscount(){
      var self = this
      var total = self.totalPrice
      if(total !== '-'){
        var disc = total - (self.totalPrice* +self.user.discount)/100
      }
      else{
        disc = '-'
      }
      return disc
    },

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
  padding:20px;
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
</style>
