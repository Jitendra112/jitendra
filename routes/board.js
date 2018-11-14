var express = require('express')
var app = express()
const {database} = require('../db.js')

// SHOW LIST OF Boards
app.get('/exam_list', async function(req, res, next) {
  
        var query = 'SELECT * FROM tbl_exams ORDER BY id DESC';
        results = await database.query(query, [] );
        res.render('admin/board/boardlist', {
        title: 'Board List',
        data: JSON.parse(results)
         })

})
app.get('/show_boards', async function(req, res, next) {

        var query = 'SELECT * FROM tbl_boards ORDER BY id DESC';
          results = await database.query(query, [] );
          //res.writeHead(200, {'Content-Type': 'application/json'});
          res.send(results);
      
    
})
// SHOW ADD BOARD FORM
app.get('/addboard', function(req, res, next){
    // render to views/user/add.ejs
    res.render('admin/board/addboard', {
        title: 'Add Eligibility',
        requirement: '',
        eligibility_type:'',
        value:'',
        unit:'',
        pursuing:'',
        category:'',
        gender:'',
    })
})

app.post('/addboard', async function(req, res, next){
    req.assert('board_name','Class Name is required').notEmpty()         //Validate class name
    var errors = req.validationErrors()
    if( !errors ) {
      var cl = {
            board_name: req.sanitize('board_name').escape().trim(),
        }

      
            var query = 'INSERT INTO tbl_boards SET ?';
            results = await database.query(query, [cl] );
                if (results) {
                    req.flash('success', 'Board added successfully!')
                    res.render('admin/board/addboard')
                } else {
                    req.flash('error', 'Board Addition failed!')
                    res.render('admin/board/addboard')
                }
            
       
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

         res.render('admin/board/addboard', {
             title: 'Add New Class',
             class_id: '',
             class_name:'',
         })
    }
})
// SHOW EDIT USER FORM
// app.get('/editeligibility/(:id)', function(req, res, next){
//     req.getConnection(function(error, conn) {
//         conn.query('SELECT * FROM eligibilities WHERE id = ' + req.params.id, function(err, rows, fields) {
//             if(err) throw err

//             // if class not found
//             if (rows.length <= 0) {
//                 req.flash('error', 'Eligibility not found with id = ' + req.params.id)
//                 res.redirect('/eligible')
//             }
//             else { // if class found
//                 // render to views/classes/editclass.ejs template file
//                 res.render('eligibility/editeligibility', {
//                     title: 'Edit Eligibilty',
//                     //data: rows[0],
//                     id: rows[0].id,
//                     requirement: rows[0].requirement,
//                     eligibility_type: rows[0].eligibility_type,
//                     unit: rows[0].unit,
//                     value: rows[0].value,
//                     pursuing: rows[0].pursuing,
//                     category: rows[0].category,
//                     gender:rows[0].gender
//                 })
//             }
//         })
//     })
// })

// EDIT classes POST ACTION
// app.put('/editeligibility/:id', function(req, res, next) {
//     req.assert('requirement', 'Requirement is required').notEmpty()           //Validate name
//     req.assert('eligibility_type', 'Eligibility Type  is required').notEmpty()
//     req.assert('unit','Unit is required').notEmpty()
//     req.assert('value','Value is required').notEmpty()
//     req.assert('pursuing', 'Pursuing Details are required').notEmpty()
//     req.assert('category', 'Category is required').notEmpty()
//     req.assert('gender', 'Gender is required').notEmpty()


//     var errors = req.validationErrors()

//     if( !errors ) {   //No errors were found.  Passed Validation!

//         /********************************************
//          * Express-validator module

//         req.body.comment = 'a <span>comment</span>';
//         req.body.username = '   a user    ';

//         req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
//         req.sanitize('username').trim(); // returns 'a user'
//         ********************************************/
//         var elg = {
//             requirement: req.sanitize('requirement').escape().trim(),
//             eligibility_type: req.sanitize('eligibility_type').escape().trim(),
//             unit: req.sanitize('unit').escape().trim(),
//             value: req.sanitize('value').escape().trim(),
//             pursuing: req.sanitize('pursuing').escape().trim(),
//             category: req.sanitize('category').escape().trim(),
//             gender: req.sanitize('gender').escape().trim(),


//         }

//         req.getConnection(function(error, conn) {
//             console.log(req.params);

//             conn.query('UPDATE eligibilities SET ? WHERE id = ' + req.params.id, elg, function(err, result) {
//                 //if(err) throw err
//                 if (err) {
//                     req.flash('error', err)

//                     // render to views/user/add.ejs
//                     res.render('eligibility/editeligibility', {
//                         title: 'Edit Eligibilities',
//                         requirement: req.body.requirement,
//                         eligibility_type: req.body.eligibility_type,
//                         unit: req.body.unit,
//                         value: req.body.value,
//                         pursuing: req.body.pursuing,
//                         category: req.body.category,
//                         gender:req.body.gender
//                     })
//                 } else {
//                     req.flash('success', 'Data updated successfully!')

//                     conn.query('SELECT * FROM eligibilities ORDER BY id DESC',function(err, rows, fields) {
//                         //if(err) throw err
//                         if (err) {
//                             req.flash('error', err)
//                             res.render('eligibility/eligibilitylist', {
//                                 title: 'Eligibility List',
//                                 data: ''
//                             })
//                         } else {
//                             // render to views/user/list.ejs template file
//                             res.render('eligibility/eligibilitylist', {
//                                 title: 'Eligibility List',
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
//         res.render('eligibility/editeligibility', {
//             title: 'Edit Eligibility',

//             requirement: req.body.requirement,
//             eligibility_type: req.body.eligibility_type,
//             unit: req.body.unit,
//             value: req.body.value,
//             pursuing:req.body.pursuing,
//             category: req.body.category,
//             gender: req.body.gender,
//         })
//     }
// })

// DELETE Class
app.delete('/delete/(:id)',async function(req, res, next) {
    var cl = { id: req.params.id }

   
           var query = 'DELETE FROM tbl_boards WHERE id = ' + req.params.id;
           results = await database.query(query, [cl] );
           if (results) {

            req.flash('success', 'Board deleted successfully!')
            // redirect to users list page
            res.redirect('/admin/board/board-list')
           
        } else {
            req.flash('error', 'Board Not Deleted!')
            // redirect to users list page
            res.redirect('/admin/board/board-list')
        }
       
  
})

module.exports = app
