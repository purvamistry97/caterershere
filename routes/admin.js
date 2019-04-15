var express = require('express');
var router = express.Router();
var session = require('cookie-session');
/* var multer  = require('multer');
var _ = require('underscore'); */

var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 10,
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'CaterersHere'
});

/* GET FOR ADMIN */
router.get('/', function(req, res){
    res.render('adminhome', {message:''});
})

/* POST FOR ADMIN */

router.post('/', function(req,res){
    let query = 'Select * from CaterersHere.Admin where Email="' + req.body.email + '"And Password="' + req.body.password + '"';
    console.log(query);
    pool.query(query, function(loginErr, loginResult){
        if(loginErr){
            console.log('the login err occured', loginErr);
        }
        else{
            if(loginResult.length > 0){
                res.redirect('/admin/adminDashboard');
            }
            else{
                res.render('adminhome', {message:'The details you entered are wrong..!'})
            }
        }
    })
})

/* GET METHOD FOR ADMIN CATERERS */
router.get('/adminDashboard', function(req, res){
    let query = 'Select * from CaterersHere.Caterers';
    pool.query(query, function(catErr, CatResult){
        if(catErr){
            res.render('error', {error:{stack: [], status: true}, message: 'catErr'})
        }
        else{
            res.render('adminDashboard', {
                Caterers: CatResult.map( item => {
                    return{
                        Name: item.Name, Address: item.Address, Phone1: item.Phone1, Phone2: item.Phone2, 
                        Email: item.Email, lessThan100: item.lessThan100, lessThan1000: item.lessThan1000,
                        moreThan1000: item.moreThan1000, Description: item.Description, minPersons: item.Min_Persons
                    }
                })
            })
        }
    })
})

/* GET METHOD FOR ADMIN ORDERS */
router.get('/adminOrders', function(req, res){
    let query = 'SELECT  co.OrderId,cp.PackageName, co.EventDate, co.Event, co.Address,co.Peoples, co.Inquiry, co.status, us.Email, us.FirstName, us.LastName, cc.Name FROM CaterersHere.Orders as co , CaterersHere.Packages as cp, CaterersHere.Users as us, CaterersHere.Caterers as cc  where co.UserId = us.UserID AND co.Package = cp.PackageId AND co.CatererId = cc.CatererId'
    pool.query(query, function(orderErr, orderResult){
        if(orderErr){
            res.render('error', {error:{stack: [], status: true}, message: 'orderErr'});
        }
        else{
            console.log(orderResult.map( item =>{
                return{
                    customerName: item.FirstName + item.LastName, catName: item.Name, Event: item.Event, EventDate: item.EventDate,
                    Package: item.PackageName, Address: item.Address, Peoples: item.Peoples, status: item.status, Inquiry: item.Inquiry
                }
            }))
            res.render('adminOrders', {
                orders: orderResult.map( item =>{
                    return{
                        customerName: item.FirstName + ' ' + item.LastName, catName: item.Name, Event: item.Event, EventDate: new Date(item.EventDate).toDateString(),
                        Package: item.PackageName, Address: item.Address, Peoples: item.Peoples, status: item.status, Inquiry: item.Inquiry
                    }
                })
            })
        }
    })
})

/* GET METHOD FOR ADMIN CUSTOMER */
router.get('/adminCustomer', function(req, res){
    let query = 'SELECT * FROM CaterersHere.Users';
    pool.query(query, function(usrErr, usrResult){
        if(usrErr){
            res.render('error', {error:{stack: [], status: true}, message: 'usrErr'})
        }
        else{
            res.render('adminCustomer', {
                Users: usrResult.map( item => {
                    return{
                        FirstName: item.FirstName, LastName: item.LastName, Email: item.Email, status: item.status
                    }
                })
            })
        }
    })
})
module.exports = router;