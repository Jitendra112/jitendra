var express = require('express')
var app = express()
const {database} = require('../db.js')

// SHOW ADMIN LOGIN FORM
app.post('/user_registration', async function(req, res, next){
	//console.log('you are here');
	req.assert('fname','First Name is required').notEmpty()           //Validate id
    req.assert('email','Email is required').notEmpty()         //Validate class name
    req.assert('phone','Phone is required').notEmpty()
    req.assert('password','Password is required').notEmpty()        //Validate class name
   
    var errors = req.validationErrors()
    
    if( !errors ) {  
        var fld = {
            first_name: req.sanitize('fname').escape().trim(),
            last_name: req.sanitize('lname').escape().trim(),
            email: req.sanitize('email').escape().trim(),
            phone:  req.sanitize('phone').escape().trim(),
            password:  req.sanitize('password').escape().trim(),
            role: 'U',
           }
           
           var query = 'INSERT INTO tbl_user  SET ? ';
           results = await database.query(query, [fld] );
           if (results) {
              // req.flash('success', 'User deleted successfully! id = ' + req.params.id)
               res.writeHead(200, {'Content-Type': 'application/json'});
               var obj = {success : 1 , message : 'Registration Done Successfully!!'}
                 res.end(JSON.stringify(obj));
           } else {
             
               res.writeHead(200, {'Content-Type': 'application/json'});
               var obj = {success : 0 , message : 'Registration Failed!! '}
                 res.end(JSON.stringify(obj));
              
           }
       
        }
    })


module.exports = app