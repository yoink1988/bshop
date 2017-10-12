<template>
  <div class="row reg">
    <div class="col-md-9" style="width:35%">
      </div>
    <div class="col-md-5" style="width:400px">
      <form role="form ">
      <div class="form-group">
        <label for="exampleInputEmail1">Email</label>
        <input v-model="login" type="email" class="form-control" id="exampleInputEmail1" placeholder="Enter email">
      </div>
      <div class="form-group">
        <label for="exampleInputName">Name</label>
        <input v-model="name" type="text" class="form-control" id="exampleInputPassword1" placeholder="Name">
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input v-model="pass" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
      </div>
      <button @click="submit()" class="btn btn-default">Submit</button>
          <p>{{msg}}</p>
    </form>

    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data () {
    return {
      msg:'',
      login:'',
      name:'',
      pass:''
    }
  },
  methods:{
    submit: function(){
      var self = this
      var xhr = new XMLHttpRequest();
      var json = JSON.stringify({
         name: self.name,
         login: self.login,
         pass: self.pass
      });

          xhr.open("POST", 'http://localhost/bookShop/client/api/users/', true)
          xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4) return
                  if (xhr.status != 200) {
                        alert(xhr.status + ': ' + xhr.statusText)
                  } else {
                    self.msg = xhr.responseText
                  }
            }
          xhr.send(json)
    }
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

.reg{
  background-color: lightblue;
}

a {
  color: #42b983;
}
</style>
