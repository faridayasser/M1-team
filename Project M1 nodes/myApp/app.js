var fs = require('fs');
var express = require('express');
const { fstat } = require('fs');
var path = require('path');
const { stringify } = require('querystring');
var app = express();
const session = require('express-session');
var bodyparser=require('body-parser');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret key',
  resave: false,
  saveUnitialized: true,
}
))


var u = 0;
var z= [];
var read = [];
var r =[];
function uexists(nameKey,passkey, myArray){
  for (var i=0; i < myArray.length; i++) {
      if (myArray[i].username === nameKey&& myArray[i].password === passkey) {
          u=i;
          return true;
      }
  }
  return false;
}
var sess;
app.get('/',function(req,res){
  res.render('login' , {error: " "})
})
app.post('/',function(req,res){
  var x = {username:req.body.username, password:req.body.password};
  if (uexists(x.username,x.password,z)){
    req.session.username = x.username;
    res.render('home')
  }
  else{
    res.render('login', {error: "This combination of username and password does not exist"})
  }
})
app.get('/dune', function(req,res){
  res.render('dune',{read:" "})
})
app.post('/dune', function(req,res){
  var mesg= addreadlist("Dune",req.session.username);
  res.render('dune', {read: mesg})
})
app.get('/fiction', function(req,res){
  res.render('fiction')
})
app.get('/flies', function(req,res){
  res.render('flies',{read: " "});
})
app.post('/flies', function(req,res){
  var mesg= addreadlist("Lord of the Flies",req.session.username);
  res.render('flies', {read: mesg})
})
app.post('/search', function(req,res){
  var key = req.body.Search+ "";
  console.log(key);
  var r0 =searching(key);
  var l0= hyperl(r0);
  console.log(r0);
  console.log(l0);
  res.render('searchresults',{li0:l0[0], li1:l0[1],li2:l0[2],li3:l0[3], li4:l0[4],li5:l0[5], re0:r0[0], re1:r0[1],re2:r0[2],re3:r0[3], re4:r0[4],re5:r0[5] ,notfound:comm(searchresultkey)})//list:searching(key), notfound: comm(searching(key))
})

app.get('/grapes', function(req,res){
  res.render('grapes',{read:" "})
})
app.post('/grapes', function(req,res){
  var mesg= addreadlist("The Grapes of Wrath",req.session.username);
  res.render('grapes', {read: mesg})
})

app.get('/home', function(req,res){
  res.render('home')
})
app.get('/leaves', function(req,res){
  res.render('leaves',{read:" "})
})
app.post('/leaves', function(req,res){
  var mesg= addreadlist("Leaves of Grass",req.session.username);
  res.render('leaves', {read: mesg})
})
app.get('/mockingbird', function(req,res){
  res.render('mockingbird',{read:" "})
})
app.post('/mockingbird', function(req,res){
  var mesg= addreadlist("To Kill a Mockingbird",req.session.username);
  res.render('mockingbird', {read: mesg})
})
app.get('/novel', function(req,res){
  res.render('novel')
})
app.get('/poetry', function(req,res){
  res.render('poetry')
})
app.get('/readlist', function(req,res){
  console.log(rlist(extlist(req.session.username)));
  res.render('readlist', {list: rlist(extlist(req.session.username))})
})

app.get('/sun', function(req,res){
  res.render('sun',{read:" "})
})
app.post('/sun', function(req,res){
  var mesg= addreadlist("The Sun and Her Flowers",req.session.username);
  res.render('sun', {read: mesg})
})
app.get('/registration', function(req,res){
  res.render('registration', {taken:" "})
})
app.post('/register',function(req,res){
  var a = {username:req.body.username, password:req.body.password};
  if(searchU(a.username,z)){     
       res.render('registration', {taken: "This username is already taken, please choose another"})
  }
  else{
  req.session.username = a.username;
  z.push(a)
  var y =JSON.stringify(z);
  fs.writeFileSync("data.json",y);
  read.push({username:a.username, readlist:[]});
  fs.writeFileSync("readlist.json",JSON.stringify(read));
  res.render('home');
  console.log(read)
}
})
app.get('/searchresults', function(req,res){
  res.render('searchresults', {list: " "})
})

function searchU(nameKey, myArray){
  for (var i=0; i < myArray.length; i++) {
      if (myArray[i].username === nameKey) {
          return true;
      }
  }
  return false;
}


function addreadlist(str, users){
  var string1= ""
  var data=fs.readFileSync('readlist.json');
  var words=JSON.parse(data);
  var user ;
  var ind;
  for(var i=0;i<words.length;i++){
    if (words[i].username === users)
      ind = i;
  }
  if (!(words[ind].readlist.includes(str))){
    read[ind].readlist.push(str);
    words[ind].readlist.push(str);
    string1 = "book added to readlist!";
  }
  else{
  string1 = "book is already in readlist!";
  }
  var back = JSON.stringify(words);
  fs.writeFileSync("readlist.json",back);
  return string1;
}


function rlist(arr){
  var s=""
  for(var i=0; i<arr.length;i++){
    s+=  arr[i] +" " +"\n";
  }
  return s;
}
function extlist(uname){
  console.log(uname);
  var var1=fs.readFileSync('readlist.json');
  var var2=JSON.parse(var1);
  console.log(var2);
  var var3;
  for(var i=0; i<var2.length;i++){
    if (var2[i].username === uname){
      var3 = var2[i].readlist;
    }
  }
  console.log(var3);
  return var3;
}
var x = " ";
function comm(myArray){
  if (myArray.length === 0){
    x = "Book not found";
    console.log(x);
  }
  else{
    x= " ";
    console.log(x);
  }
  return x;
}

var searchresultkey = [];
var r= false;
function searching(key){
  var k= key.toLowerCase();
  searchresultkey = [];
  if(key.length!=0){
  var l = ['Lord of the Flies', 'The Grapes of Wrath',  'Leaves of Grass', 'To Kill a Mockingbird', 'Dune','The Sun and Her Flowers'];
  for(var i=0; i<l.length; i++){
    r = (l[i].toLowerCase()).includes(k);
    console.log(r);
      if (r || l[i].toLowerCase()=== k){
        console.log(l[i]);
        searchresultkey.push(l[i]);
    }
  }
  
}
return searchresultkey;
}
function hyperl(arr){
  var link = [];
  for(var i=0; i<arr.length;i++){
    switch(arr[i]){
      case "Lord of the Flies": link.push('flies')
      break;
      case "The Sun and Her Flowers" :link.push('sun')
      break;
      case "Leaves of Grass" :link.push('leaves')
      break;
      case "To Kill a Mockingbird": link.push('mockingbird')
      break;
      case "The Grapes of Wrath": link.push('grapes')
      break;
      default:
        link.push('dune')
  }
}
return link;
}
function fill(arr){
  var l = arr.length;
  if(l<6){
    for(l; l<6;l++){
      arr.push('');
    }
  }
  return arr;
}


app.listen(3000);