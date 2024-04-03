const express = require('express');
const mongoose = require('mongoose');

let srudentmongoo = mongoose.Schema({
    name: String,
    address: String
})
let student = mongoose.model('student', srudentmongoo);
const server = express();

server.listen(5000 , ()=>{
    console.log("Server is running on port: 5000");
})
server.get('/', function(req, res){
    res.send('Hello World');
});
server.get('/api/students', function(req, res){
    let students = [{
        names : 'Abdul Mateen',
        address:'Lahore'
    },{
        name: 'Ali',
        address: 'Karachi'
    }]
    res.send(students);
})
// mongoose.connect('mongodb://localhost:27017/express', {useNewUrlParser: true, useUnifiedTopology: true})