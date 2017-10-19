<template>
  <div class="edit-user">
    EDIT USER
    <p>{{msg}}</p>
    <!-- {{userData.login}} -->

    <div class="form">
      <p>Name:<input v-model="userData.name" type="text" :value="userData.name"></p>
      <p>Login\Email:<input v-model="userData.login" type="email" :value="userData.login"></p>
      <p> Discount:<input v-model="userData.discount" type="text" :value="userData.discount"></p>
      <p> New Password:<input v-model="userData.pass" type="text" value=""></p>
      <p>Status: {{StatusString}} <button @click="changeStatus()" >Change</button></p>
      <p><button @click="save()">Save</button></p>
    </div>
   </div>
</template>

<script>
export default {
  name: 'EditUser',
  data () {
    return {
      user:'',
      userData:'',
      msg:''
    }
  },
  created(){
    this.getUser()
  },
  methods:{
    getUser: function(){

        var self = this
        var xhr = new XMLHttpRequest()
        xhr.open('GET', getUrl()+'users/'+this.$route.params.id, true)
          xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return
              if (xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText)
              } else {
                console.log(JSON.parse(xhr.responseText)[0])
                var res = JSON.parse(xhr.responseText)
                if(typeof(res) == 'string'){
                  self.msg = res
                }
                else{
                  self.userData = JSON.parse(xhr.responseText)[0]
                  self.userData.status = !!+self.userData.status
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
              xhr.onreadystatechange = function() {
                  if (xhr.readyState != 4) return
                    if (xhr.status != 200) {
                          alert(xhr.status + ': ' + xhr.statusText)}
                          else {
                            console.log(xhr.responseText)
                            // self.getOrders()
                    }
              }
            xhr.send(json)

    },

  },
  computed:{
    StatusString(){
      var self = this
      if(self.userData.status){
        return 'Active'
      }
      return 'Inactive'
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

  .book{
  background-color: lemonchiffon;

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

.info{
  width: 40%;
  margin: auto;
}

a {
  color: #42b983;
}
</style>
