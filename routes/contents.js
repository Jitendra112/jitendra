var express = require('express')
var app = express()
const {database} = require('../db.js')
//var formidable = require('formidable');
 
// SHOW LIST OF classes
app.get('/contentlist',async function(req, res, next){
   
        var query = 'select * from tbl_class where id in (select class_id from tbl_topic) ORDER BY id ASC';
          results = await database.query(query, [] );
              res.render('admin/content/contentlist', {
                  title: 'Add content',
                  data: JSON.parse(results)
              }) 
  
  })

app.get('/showfile', async function(req, res, next) {
      var query = 'SELECT * FROM tbl_contents where file_type = "0" and topic_id = '+req.query.id;
       results = await database.query(query, [] );
         // res.writeHead(200, {'Content-Type': 'application/json'});
          res.send(results);
        
  
})
app.get('/showpdf', async function(req, res, next) {  
      var query = 'SELECT * FROM tbl_contents where file_type = "1" and topic_id = '+req.query.id;
        results = await database.query(query, [] );
         // res.writeHead(200, {'Content-Type': 'application/json'});
          res.send(results);
       
 
})





app.get('/addcontent', async function(req, res, next){
 
     var query = 'select * from tbl_class where id in (select class_id from tbl_topic) ORDER BY id ASC';
            results = await database.query(query, [] );
            
              res.render('admin/content/addcontent', {
                  title: 'Add Subject',
                  data:JSON.parse(results)
              })  
    })
  
    app.get('/show_subject',async function(req, res, next) {
    
      var query = 'SELECT tbl_subjects.*, tbl_topic.topic_name FROM tbl_subjects LEFT JOIN tbl_topic ON tbl_subjects.id = tbl_topic.subject_id WHERE tbl_topic.class_id = '+ req.query.id + ' GROUP BY subject_name ';
       //console.log(query);
         results = await database.query(query, [] );
          //res.writeHead(200, {'Content-Type': 'application/json'});
          res.send(results);
       
   
  })
// SHOW LIST OF TOPICS WITH DESCRIPTION
app.get('/show_topic_name', async function(req, res, next) {
  var query = 'SELECT * FROM tbl_topic where subject_id = ' + req.query.id + '&&class_id = ' + req.query.vid;
   results = await database.query(query, [] );
    // console.log(results)
      res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(results);
})
// ADD NEW Content POST ACTION
/*
* GET home page.
*/
 
app.post('/mycontent', async function(req, res, next){


    message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var cls = post.class_id;
      var subject = post.subject_id;
      var topic = post.topic_id;
      var my_title = post.my_title;
      var myfile_type = post.filetype;
      var content_wise = post.content_desc
	 
       if(content_wise == ''){
		var file = req.files.pdf;
		var img_name=file.name;

	  	 if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ||file.mimetype == "application/pdf"){
                                 
              file.mv('assets/uploads/pdf/'+file.name, async function(err) {
                             
                  
      		var query = "INSERT INTO `tbl_contents`(`class_id`,`subject_id`,`topic_id`,`file_type`,`content_title`,`file`) VALUES ('" + cls + "','" + subject + "','" + topic + "','" + myfile_type + "','" + my_title + "','" + img_name + "')";
            results = await database.query(query, [] );  
    		 if (results) {
              req.flash('success', 'Content added successfully!')
              res.redirect('/admin/content/addcontent')
             } else {                
             
                req.flash('error', err)
                res.redirect('/admin/content/addcontent')
             }
           	   
            });
          } else {
            req.flash('error', "This format is not allowed , please upload file with '.png','.gif','.jpg','.pdf'") 
            res.redirect('/admin/content/addcontent')
          }

       }else{

       
         var query = "INSERT INTO `tbl_contents`(`class_id`,`subject_id`,`topic_id`,`file_type`,`content_title`,`content_desc` ) VALUES ('" + cls + "','" + subject + "','" + topic + "','" + myfile_type + "','" + my_title + "','" + content_wise + "')";
         results = await database.query(query, [] );
         
           if (results) {
            req.flash('success', 'Content added successfully!')
            res.redirect('/admin/content/addcontent')
                        
            } else {                
            req.flash('error', err)
            res.redirect('/admin/content/addcontent')
        }
    }   
   } else {
      res.render('addcontent');
   }
 
});
//TO GRT SUBJECT LIST
app.get('/show_subject',async function(req, res, next) {
    
  var query = 'SELECT tbl_subjects.*, tbl_topic.topic_name FROM tbl_subjects LEFT JOIN tbl_topic ON tbl_subjects.id = tbl_topic.subject_id WHERE tbl_topic.class_id = '+ req.query.id + ' GROUP BY subject_name ';
 
     results = await database.query(query, [] );
      //res.writeHead(200, {'Content-Type': 'application/json'});
      res.send(results);
   

})
// SHOW LIST OF TOPICS
//   app.get('/show_topic', async function(req, res, next) {
//       var query = 'SELECT * FROM tbl_topic where subject_id = ' + req.query.id;
//        results = await database.query(query, [] );
//         // console.log(results)
//           res.writeHead(200, {'Content-Type': 'application/json'});
//             res.end(results);
      
   
// })
 
// SHOW EDIT USER FORM
// app.get('/editcontent/(:id)', function(req, res, next){
//     req.getConnection(function(error, conn) {
//         conn.query('SELECT * FROM content WHERE id = ' + req.params.id, function(err, rows, fields) {
//             if(err) throw err
            
//             // if class not found
//             if (rows.length <= 0) {
//                 req.flash('error', 'Content not found with id = ' + req.params.id)
//                 res.redirect('/contents')
//             }
//             else { // if class found
//                 // render to views/classes/editclass.ejs template file
//                 res.render('content/editcontent', {
//                     title: 'Edit Content', 
//                     //data: rows[0],
//                     id: rows[0].id,
//                     pdf_link: rows[0].pdf_link,
//                     heading: rows[0].heading,
//                     content:rows[0].content,
//                     flipbook: rows[0].flipbook,
//                     keywords: rows[0].keywords,
//                     tags: rows[0].tags,
//                     owner: rows[0].owner,                    
//                 })
//             }            
//         })
//     })
// })
 
// EDIT classes POST ACTION
// app.put('/editcontent/:id', function(req, res, next) {
//     req.assert('pdf_link', 'PDF-Link is required').notEmpty()           //Validate name
//     req.assert('heading', 'Heading is required').notEmpty()
//     req.assert('content', 'Content is required').notEmpty()
//     req.assert('flipbook','flipbook is required').notEmpty()
//     req.assert('keywords','Keywords are required').notEmpty()
//     req.assert('tags', 'Tags are required').notEmpty()
//     req.assert('owner', 'Owner is required').notEmpty()
    
//     var errors = req.validationErrors()
    
//     if( !errors ) {   //No errors were found.  Passed Validation!
        
//         /********************************************
//          * Express-validator module
         
//         req.body.comment = 'a <span>comment</span>';
//         req.body.username = '   a user    ';
 
//         req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
//         req.sanitize('username').trim(); // returns 'a user'
//         ********************************************/
//         var cont = {
//             pdf_link: req.sanitize('pdf_link').escape().trim(),
//             heading: req.sanitize('heading').escape().trim(),
//             content: req.sanitize('content').escape().trim(),
//             flipbook: req.sanitize('flipbook').escape().trim(),
//             keywords: req.sanitize('keywords').escape().trim(),
//             tags: req.sanitize('tags').escape().trim(),
//             owner: req.sanitize('owner').escape().trim(),
            
                     
//         }
        
//         req.getConnection(function(error, conn) {
//             console.log(req.params);

//             conn.query('UPDATE content SET ? WHERE id = ' + req.params.id, cont, function(err, result) {
//                 //if(err) throw err
//                 if (err) {
//                     req.flash('error', err)
                    
//                     // render to views/user/add.ejs
//                     res.render('content/editcontent', {
//                         title: 'Edit Content',
//                         pdf_link: req.body.pdf_link,
//                         heading: req.body.heading,
//                         content:req.body.content,
//                         flipbook: req.body.flipbook,
//                         keywords: req.body.keywords,
//                         tags: req.body.tags,
//                         owner: req.body.owner,
//                     })
//                 } else {
//                     req.flash('success', 'Data updated successfully!')
                    
//                     conn.query('SELECT * FROM content ORDER BY id DESC',function(err, rows, fields) {
//                         //if(err) throw err
//                         if (err) {
//                             req.flash('error', err)
//                             res.render('content/contentlist', {
//                                 title: 'Content List', 
//                                 data: ''
//                             })
//                         } else {
//                             // render to views/user/list.ejs template file
//                             res.render('content/contentlist', {
//                                 title: 'Content List', 
//                                 data: rows
//                             })
//                         }
//                     })
//                 }
//             })
//         })
//     }
//     else {   //Display errors to user
//         var error_msg = ''
//         errors.forEach(function(error) {
//             error_msg += error.msg + '<br>'
//         })
//         req.flash('error', error_msg)
        
//         /**
//          * Using req.body.name 
//          * because req.param('name') is deprecated
//          */ 
//         res.render('content/editcontent', { 
//             title: 'Edit Content',            
            
//             pdf_link: req.body.pdf_link,
//             heading: req.body.heading,
//             content:req.body.content,
//             flipbook: req.body.flipbook,
//             keywords: req.body.keywords,
//             tags: req.body.tags,
//             owner: req.body.owner,
//         })
           
//     }
// })



// DELETE Class
app.get('/delete',async function(req, res, next) {
    var sbj = { id: req.params.id }

    
       var query = 'DELETE FROM  tbl_contents WHERE id = ' + req.query.id;
          results = await database.query(query, [sbj] );
            if ( results) {
                res.writeHead(200, {'Content-Type': 'application/json'});
                var obj = {success : 1 , message : 'Content Deleted successfully'}
                  res.end(JSON.stringify(obj));
            } else {
                
                res.writeHead(200, {'Content-Type': 'application/json'});
                var obj = {success : 0 , message : 'Content Not Deleted'}
                  res.end(JSON.stringify(obj));
            }   
})

module.exports = app