<template>
  <div class="edit-user">
    EDIT USER <b>{{userData.id}}</b>

    <div class="row">
      <div class="col-md-5">

          <form style="margin:auto">
            <div class="form-group">
              <label for="exampleInputEmail1">Name</label>
              <input  v-model="userData.name"  type="text" class="form-control" >
            </div>
            <div class="form-group">
              <label for="exampleInputEmail1">Email</label>
              <input  v-model="userData.login"  type="email" class="form-control" >
            </div>
            <div class="input-group">
              <span class="input-group-addon">Discount</span>
              <input v-model="userData.discount" type="text" class="form-control" >
            </div>
            <div class="form-group">
              <label for="exampleInputEmail1"> New password</label>
              <input  v-model="userData.pass"  type="password" value="" class="form-control" >
            </div>
            <div class="input-group">
              <span class="input-group-addon">{{StatusString}}</span>
              <button @click="changeStatus()" type="submit" class="btn btn-primary">Change</button>
            </div>         

              <button @click="save()" type="button" class="btn btn-primary btn-lg btn-block">Save</button>
          </form>
            {{msg}}
        </div>
   </div>

   <div class="row">
     <button @click="showUserOrders()" class="show">Show Orders
     </button>

   </div>
     <div v-if="showOrdrers" class="row">
      <user-orders  :id="userData.id" :user="user"></user-orders>
     </div>
   </div>
</template>

<script>
import AdminUserOrders from './AdminUserOrders'
export default {
  name: 'EditUser',
      beforeRouteUpdate(to, from, next) {
        this.getUser(to.params.id)
        this.showOrdrers = false
        this.orderMsg = ''
        next()
    },
  data () {
    return {
      user:'',
      userData:'',
      msg:'',
      showOrdrers: false,
      orderMsg: ''
    }
  },
  created(){
    this.getUserData()
    this.getUser(this.$route.params.id)
  },
  
  methods:{
         checkAuth: function(){
      var self = this
      var xhr = new XMLHttpRequest();
          xhr.open("GET", getUrl()+'auth/', true)
          xhr.setRequestHeader("Authorization", "Basic " + btoa(self.user.id+":"+self.user.hash));
          xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return
                  if (xhr.status != 200) {
                  } else{
                   var res = JSON.parse(xhr.responseText)
                   if(!res){
                    self.user.name = ''
                    self.user.role = 'guest'
                    self.user.id = '0'
                    self.user.hash = '0'
                   }
                   else{
                     self.getUserInfo()
                   }
                  }
            }
          xhr.send()        
      },
      getUserInfo: function(){
      var self = this
      var xhr = new XMLHttpRequest();
          xhr.open("GET", getUrl()+'users/'+self.user.id, true)
          xhr.setRequestHeader("Authorization", "Basic " + btoa(self.user.id+":"+self.user.hash));
          xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return
                  if (xhr.status != 200) {
                  } else{
                   var res = JSON.parse(xhr.responseText)
                   if(!res){
                    self.user.name = ''
                    self.user.role = 'guest'
                    self.user.id = '0'
                    self.user.hash = '0'
                   }
                   else{
                    self.user = res[0]
                    self.checkRole()
                   }
                  }
            }
          xhr.send()  
      },

      getUserData: function(){
        var self = this
        if(localStorage['user'])
        {
         self.user = JSON.parse(localStorage['user'])
        }
        else
        {
          self.user.name = ''
          self.user.role = 'guest'
          self.user.id = '0'
          self.user.hash = '0'

        }
        self.checkAuth()
      },
    checkRole: function(){
      var self = this
      if(self.user.role != 'admin')
      {
        self.$router.push('/')
      }
  },
    getUser: function(id){
        var self = this
        var xhr = new XMLHttpRequest()
        xhr.open('GET', getUrl()+'users/'+id, true)
          xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return
              if (xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText)
              } else {
                var res = JSON.parse(xhr.responseText)
                if(res){
                  self.userData = res[0]
                  self.userData.status = !!+self.userData.status
                }
                else{
                  self.$router.push('/admin/')
                }

              }
          }
          xhr.send();
    },
    changeStatus: function(){
      var self = this
      self.userData.status = !self.userData.status
    },
    save: function(){
      var self = this
        var xhr = new XMLHttpRequest();
        var json = JSON.stringify(self.userData);
            xhr.open("PUT", getUrl()+'users/', true)
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.setRequestHeader("Authorization", "Basic " + btoa(self.user.id+":"+self.user.hash));            
              xhr.onreadystatechange = function() {
                  if (xhr.readyState != 4) return
                    if (xhr.status != 200) {
                          alert(xhr.status + ': ' + xhr.statusText)}
                          else {
                            var res = JSON.parse(xhr.responseText)
                            if(res === true){
                              self.msg = 'Updated'
                              self.$parent.getUsers()
                            }
                            else{
                              self.msg = res
                            }
                            self.getUser(self.$route.params.id)
                    }
              }
            xhr.send(json)

    },
        getOrders: function(){
        var self = this
        var xhr = new XMLHttpRequest()
        xhr.open('GET', getUrl()+'orders/'+self.userData.id, true)
          xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return
              if (xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText)
              } else {
                var res = JSON.parse(xhr.responseText)
                if(!res){
                  self.msg = "Have no orders"
                }
                else{
                  self.userData.orders = JSON.parse(xhr.responseText)
                }

              }
        }
        xhr.send();
    },
    showUserOrders: function(){
      var self = this
      self.orderMsg = ''
      self.showOrdrers = !self.showOrdrers
    }

  },
  computed:{
    StatusString(){
      var self = this
      if(self.userData.status){
        return 'Active'
      }
      return 'Inactive'
    },
  },
  components:{
    'user-orders': AdminUserOrders
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
