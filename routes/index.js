
var express = require('express')
var app = express()
const {database} = require('../db.js')
const passport = require('passport');

app.get('/', function(req, res, next) {
    
        res.render('sellbuy/index', {
            title: 'Add content',
            
        }) 
})

app.get('/registration', async function(req, res, next) {
   
    var query = "select * from tbl_countries ORDER BY id ASC";
    results = await database.query(query, [] );
    res.render('sellbuy/registration', {
        title: 'Add content',
        data: JSON.parse(results)
    }) 
})

app.post('/register',async function(req, res, next){
            
    
      var cl = {
          
            user_name: req.sanitize('user_name').escape().trim(),
            email: req.sanitize('email_address').escape().trim(),
            password: req.sanitize('password').escape().trim(),
            country_id: req.sanitize('country').escape().trim(),
            state_id: req.sanitize('State').escape().trim(),
            postal_code: req.sanitize('postal_code').escape().trim(),
            role: 'U',
        }

       
            var query = 'INSERT INTO tbl_user  SET ? ';
            results = await database.query(query, [cl] );
                if (results) {
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    var obj = {success : 1 , message : 'Registration Done Successfully!!'}
                    res.end(JSON.stringify(obj));
                    
                } else {

                    res.writeHead(200, {'Content-Type': 'application/json'});
                    var obj = {success : 0 , message : 'Registration Failed!! '}
                    res.end(JSON.stringify(obj));
                    
                }
           
})

app.get('/login', function(req, res, next) {

    res.render('sellbuy/login', {
        title: 'Add content',
        
    }) 
})
var sess;
app.post('/user_login',async function(req, res, next){
       sess=req.session;
       sess.udata;
      
    //console.log(sess)
   

       var query = 'SELECT * FROM tbl_user Where user_name = "' + req.body.user_name + '" && password = "' + req.body.password  + '"';
        //console.log(query);
        results = await database.query(query, [] );
        //console.log(results);
        if(results.length > 0 ){
         
          sess.udata = JSON.parse(results);
        
        
       
                  res.writeHead(200, {'Content-Type': 'application/json'});
                  var obj = {success : 1 , message : 'Login Successfully!!'}
                  res.end(JSON.stringify(obj));
                  
              } else {

                  res.writeHead(200, {'Content-Type': 'application/json'});
                  var obj = {success : 0 , message : 'Login Failed!! '}
                  res.end(JSON.stringify(obj));
                  
              }

      
})

app.get('/sellcar', function(req, res, next) {
   // console.log(req.session.udata); 
 res.locals.udata = req.session.udata;
 var g = res.locals.udata;

if(g) {
        res.render('sellbuy/sellcar', {
            title: 'Add content',
             
    }) 
 } else{
    res.render('sellbuy/login', {
        title: 'Add content',
        
    }) 

 }
})

app.get('/logout', function (req, res) {
    req.session.destroy();
      res.redirect('/login');
  });

app.get('/show_states', async function(req, res, next) {
    var query = 'SELECT * FROM  tbl_states where country_id = '+req.query.id;
     results = await database.query(query, [] );
       // res.writeHead(200, {'Content-Type': 'application/json'});
        res.send(results);  
});


// Auth wiith google


// app.get('/google', passport.authenticate('google', {


//   scope:['profile' , 'email']

// }))

// // callback route for google to redirect

// app.get('/google/redirect',passport.authenticate('google'),(req,res)=> {

//   res.send('You reached callback URI');


// });




// app.get('/selectclass', async function(req, res, next) {
//     req.session.myclass =  req.query.id;
//     var query = 'SELECT * FROM  tbl_topic where class_id = ' +req.query.id +  '  && subject_id=' + req.query.sid;
//     console.log(query);
//      results = await database.query(query, [] );
//        // res.writeHead(200, {'Content-Type': 'application/json'});
//         res.send(results);


// })


// app.get('/selectdesc', async function(req, res, next) {
//     var query = 'SELECT description FROM  tbl_topic where id = '+req.query.id;
//      results = await database.query(query, [] );
//        // res.writeHead(200, {'Content-Type': 'application/json'});
//         res.send(results);


// })

// app.get('/selectsubject', async function(req, res, next) {
//     var query = 'SELECT * FROM  tbl_topic where subject_id = '+req.query.id + '&& class_id=' + req.query.sid;
//      results = await database.query(query, [] );
//        // res.writeHead(200, {'Content-Type': 'application/json'});
//         res.send(results);


// })



// app.get('/board-material',async function(req, res, next) {
//     var board
//     var myboards
//     var sub
//     var education 
//     var current_subs = req.query.id;
//     var query = 'SELECT id FROM tbl_class LIMIT 1';
//     education = await database.query(query, [] );
//     var query ="SELECT id FROM tbl_subjects LIMIT 1";
//     sub = await database.query(query, [] );
//     var query = 'SELECT * FROM tbl_class ORDER BY id ASC';
//     board = await database.query(query, [] );
//     var query = 'SELECT * FROM tbl_boards';
//     myboards = await database.query(query, [] );
//     var data  = {
//         education: JSON.parse(education),
//         sub: JSON.parse(sub),
//         board: JSON.parse(board),
//         myboards : JSON.parse(myboards),
//         current_subs : current_subs
//     }
//     res.render('site/board-material', {
//         title: 'Class List',
//         data: data
//     })
// })
// // app.get('/entranc-exam',async function(req, res, next) {
// //      var eng
// //      var query = 'SELECT exam_type from tbl_exam_type';
// //      eng = await database.query(query, [] );
// //      console.log(eng);
// //      var data = {
// //         eng: JSON.parse(eng)
// //      }
// //     res.render('site/entranc-exam', {
// //         title: 'Class List',
// //         data: data
// //     })
// // })

// app.get('/career-guidance', function(req, res, next) {
//     res.render('site/career-guidance', {
//         title: 'Class List',
//         data: 'this is site index'
//     })
// })

// app.get('/blog-discussion',async function(req, res, next) {

//     var subjects ;
//     var classes;
//     var boards;
//     var query = 'SELECT * FROM tbl_subjects GROUP BY subject_name ORDER BY id ASC';
//     subjects = await database.query(query, [] );
//     var query = 'SELECT * FROM tbl_class GROUP BY class_name ORDER BY id ASC';
//     classes = await database.query(query, [] );
//     var query = 'SELECT * FROM tbl_boards GROUP BY board_name ORDER BY id ASC';
//     boards = await database.query(query, [] );
//     var data  = {
//         boards : JSON.parse(boards),
//         classes : JSON.parse(classes),
//         subjects : JSON.parse(subjects)
//     }
//         res.render('site/blog-discussion', {
//             title: 'Add content',
//             data: data
//         }) 
    
// })

// app.get('/blog_subjectwise', function(req, res, next) {
//     res.render('site/blog_subjectwise', {
//         title: 'Class List',
//         data: 'this is site index'
//     })
// })

// app.get('/blog_subject_topic', function(req, res, next) {
//     res.render('site/blog_subject_topic', {
//         title: 'Class List',
//         data: 'this is site index'
//     })
// })

// app.get('/test_your_self',async function(req, res, next) {

//     var subjects ;
//     var classes;
//     var boards;
//     var query = 'SELECT * FROM tbl_subjects GROUP BY subject_name ORDER BY id ASC';
//     subjects = await database.query(query, [] );
//     var query = 'SELECT * FROM tbl_class GROUP BY class_name ORDER BY id ASC';
//     classes = await database.query(query, [] );
//     var query = 'SELECT * FROM tbl_boards GROUP BY board_name ORDER BY id ASC';
//     boards = await database.query(query, [] );
//     var data  = {
//         boards : JSON.parse(boards),
//         classes : JSON.parse(classes),
//         subjects : JSON.parse(subjects)
//     }
//         res.render('site/test_your_self', {
//             title: 'Add content',
//             data: data
//         }) 
   
// })

// app.get('/entrance_exam',async function(req, res, next) {
//       var eng
//       var engi
//       var query = 'SELECT exam_name from tbl_exams Where exam_type_id = 1';
//       engi = await database.query(query, [] );
//       console.log(engi);
//      var query = 'SELECT exam_type from tbl_exam_type';
//      eng = await database.query(query, [] );
//     //console.log(eng);
//      var data = {
//         eng: JSON.parse(eng),
//         engi: JSON.parse(engi)
//      }
//     res.render('site/entrance_exam', {
//         title: 'Class List',
//         data: data
//     })
// })

// app.get('/engineering_entrancexam', function(req, res, next) {
//     res.render('site/engineering_entrancexam', {
//         title: 'Class List',
//         data: 'this is site index'
//     })
// })





// app.get('/cbse-board', function(req, res, next) {
//     res.render('site/cbse-board', {
//         title: 'Class List',
//         data: 'this is site index'
//     })
// })

// app.get('/career_after10', function(req, res, next) {
//     res.render('site/career_after10', {
//         title: 'Class List',
//         data: 'this is site index'
//     })
// })


// app.get('/subject_subcategory', function(req, res, next) {
//     res.render('site/subject_subcategory', {
//         title: 'Class List',
//         data: 'this is site index'
//     })
// })
// app.get('/subject_topic', function(req, res, next) {
//     res.render('site/subject_topic', {
//         title: 'Class List',
//         data: 'this is site index'
//     })
// })



// app.get('/subject-topic', function(req, res, next) {
//     res.render('site/subject-topic', {
//         title: 'Class List',
//         data: 'this is site index'
//     })
// })

// app.get('/test_yourself_subjectwise', function(req, res, next) {
//     res.render('site/test_yourself_subjectwise', {
//         title: 'Class List',
//         data: 'this is site index'
//     })
// })

// app.get('/test_yourself_subcategory', function(req, res, next) {
//     res.render('site/test_yourself_subcategory', {
//         title: 'Class List',
//         data: 'this is site index'
//     })
// })

// app.get('/quiz_test', function(req, res, next) {
//     res.render('site/quiz_test', {
//         title: 'Class List',
//         data: 'this is site index'
//     })
// })

// app.get('/admin/', function(req, res, next) {
//     res.render('admin/index', {
//         title: 'Class List',
//         data: 'this is site index'
//     })
// })

// app.get('/admin/dashboard', function(req, res, next) {
//     res.render('admin/dashboard/index', {
//         title: 'Class List',
//         data: 'this is site index'
//     })
// })

// app.get('dashboard/', function(req, res, next) {
//     res.render('admin/dashboard/add-book', {
//         title: 'Class List',
//         data: 'this is site index'
//     })
// })

/**
 * We assign app object to module.exports
 *
 * module.exports exposes the app object as a module
 *
 * module.exports should be used to return the object
 * when this file is required in another module like app.js
 */
module.exports = app;
