<template>
  <div class="cart row" style="margin:20px">
    <div v-if="content == 'cart'" class="col" style="text-align:center">
    <h4>Cart</h4>
    <div v-if="booksInCart">
      
      <table class="table" style="bacground:#fce3c7">
        <thead>
        <tr><td style="width:50px">Remove</td><td>Title</td><td>Count</td><td>Price</td><td>Discount</td><td>Actual Price</td><td>Summary</td></tr>
         </thead>
        <tbody>
        <tr v-for="(book, index) in booksInCart" :key="book.id">
          <td>
            <input type="checkbox" v-model="booksInCart[index].checkbox"  name="" id="">
          </td>
          <td>
            {{book.title}}
          </td>
          <td>
            <button @click="plus(index)" class="plus btnn">+</button>
            <input v-model="booksInCart[index].count" type="text" :value="book.count" size="3" class="count"> 
            <button @click="minus(index)" class="minus btnn">-</button>
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
        </tbody>
      </table>

    
      <div class="row">
          <div class="col">
            <span class="lighter"><b>{{saveMsg}}</b></span><p><button  @click="refresh()" class="save btnn ">Apply Changes</button></p>
            <p><span >Total price:{{totalPrice}} $</span></p>
            <p><span>Your discount: {{user.discount}} %</span></p>
            <div>Total price with your discount:{{totalWithUserDiscount }} $<p><button @click="goCheckOut()" class="checkout btnn">Check out</button></p>
            </div>
          </div>
      </div>


  </div>
    <div v-else>
      {{msg}}
    </div>
    </div>
     <div v-if="content == 'checkout'" style="width:300px;margin: 60px auto;background:#fce3c7;padding:10px"  class="checkout">
       <div style="width:200px;margin: auto;padding:20px">
         <label for="form-check">Choose Pay method:</label>
        <div style="text-align:left" v-for="(payMeth, index) in payment" :key="payMeth.id" class="form-check">
            <input  v-model="checkedPayment" name="id_payment" :value="payMeth.id"  class="form-check-input" type="radio" id="gridRadios2" >
            {{payMeth.name}}</input>
        </div>    
       </div>
       <div style="text-align:center">
      <button  @click="addOrder()"class="btnn">Add Order</button>
      <button @click="goCart()" class="btnn">Back to Cart</button>
     </div>
     </div>
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
      content: 'cart'
    }
  },
  created(){
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
                if(res === false){
                  self.msg = 'Cart is empty yet'
                  self.booksInCart =''
                }
                else{
                  res.forEach(function(el){
                    el.checkbox = false
                  })
                  self.booksInCart = res
                }
              }
        }
        xhr.send();
    },
    plus: function(index){
      var self = this
      self.booksInCart[index].count++
      self.saveMsg = 'Not Aplyed'
    },
    minus: function(index){
      var self = this
      self.saveMsg = 'Not Aplyed'
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
                      var res = JSON.parse(xhr.responseText)
                       if(res !== true){
                         self.saveMsg = 'Count must be a positive Integer'
                       }else{
                         self.saveMsg = 'Updated'
                       }
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
      self.content = 'checkout'
      self.getBooksFromCart()
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
                var res = JSON.parse(xhr.responseText)
                if(res === false){
                  self.msg = 'Payment not found'
                }
                else{
                    res.forEach(function(el){
                    el.checked = false
                  })
                  self.payment = res
                }
              }
        }
        xhr.send();
    },
    goCart: function(){
      var self = this
      self.content = 'cart'
   
    },
    addOrder:function(){
      var self = this
      var books = self.booksInCart
      var payment = self.checkedPayment
      if(payment){
        var order = [{'id_user':self.user.id, 'id_payment':payment, 'disc_user':self.user.discount}]
        var orderInfo = []
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
                    var res = JSON.parse(xhr.responseText)
                    if(res){
                    self.clearCart()
                    }
                    else{
                      self.msg = 'Sorry, try again later'
                    }
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
                    var res = JSON.parse(xhr.responseText)
                    if(res){
                      self.$router.push({ path: '/thankyou/'})
                    }
                    else{
                      self.msg = 'Sorry, try again later'
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
      return disc.toFixed(2)
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

.btnn{
  height: 30px;
  background:#FFDCA8;
  color:black;
}

.lighter{
  background-color: #fce3c7;
}
</style>
