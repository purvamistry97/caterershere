var express = require('express');
var router = express.Router();
var session = require('cookie-session');
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');
var multer  = require('multer');
var _ = require('underscore');
var pass = require('dotenv').config();
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + new Date().getTime())
  }
})

var upload = multer({ storage: storage });
//var upload = multer({ dest: 'uploads/' });

// var mysql      = require('mysql');
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : 'root',
//   database : 'CaterersHere'
// });
var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 10,
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'CaterersHere'
});

// make it dynamic using session
var userid = 10;

/* GET home page. */
router.get('/', function(req, res, next) {

  // connection.connect();
  pool.query('SELECT * FROM CaterersHere.Caterers', function(error, results){
    if(error){
      //console.log('error', error);
      res.render('index', {caterers: [], searchedCaterer:[], sessionUser:[]})
    }
    else{
      let sessionKeyList = Object.keys(req.session);
      console.log('the key list is:', sessionKeyList.indexOf('user'), req.session);
      if(sessionKeyList.indexOf('user') === -1){
        console.log('the session is:', req.session);
        Result = results.map(item =>{
        return{ 'CatererId': item.CatererId, 'Name': item.Name, 'Address': item.Address, 'Phone1': item.Phone1, 'Phone2':item.Phone2,
          'Email': item.Email, 'lessThan100': item.lessThan100, 'lessThan1000': item.lessThan1000, 'moreThan1000':item.moreThan1000
        }
        })
        console.log('results', Result);
        res.render('index', {  caterers: results.map(item =>{
        return{ 'CatererId': item.CatererId, 'Name': item.Name, 'Address': item.Address, 'Phone1': item.Phone1, 'Phone2':item.Phone2,
          'Email': item.Email, 'lessThan100': item.lessThan100, 'lessThan1000': item.lessThan1000, 'moreThan1000':item.moreThan1000
        }
        }), searchedCaterer:[], sessionUser : []});
      }
      else if(req.session.user.length === 0){
        console.log('the session is:', req.session);
        Result = results.map(item =>{
        return{ 'CatererId': item.CatererId, 'Name': item.Name, 'Address': item.Address, 'Phone1': item.Phone1, 'Phone2':item.Phone2,
          'Email': item.Email, 'lessThan100': item.lessThan100, 'lessThan1000': item.lessThan1000, 'moreThan1000':item.moreThan1000
        }
        })
        console.log('results', Result);
        res.render('index', {  caterers: results.map(item =>{
        return{ 'CatererId': item.CatererId, 'Name': item.Name, 'Address': item.Address, 'Phone1': item.Phone1, 'Phone2':item.Phone2,
          'Email': item.Email, 'lessThan100': item.lessThan100, 'lessThan1000': item.lessThan1000, 'moreThan1000':item.moreThan1000
        }
        }), searchedCaterer:[], sessionUser : req.session.user});
      }
      else{
        pool.query('Select * from CaterersHere.Users Where UserID=' + req.session.user.UserID, function(usrErr, usrResult){
          if(usrErr){
            res.render('index', {isError: true, caterers: [], searchedCaterer:[], sessionUser:[]})
          }
          else{
            console.log('the data:', usrResult.map(item=>{
              return{
                'FirstName': item.FirstName, 'LastName': item.LastName
              }
            }));
            res.render('index', {  caterers: results.map(item =>{
              return{ 'CatererId': item.CatererId, 'Name': item.Name, 'Address': item.Address, 'Phone1': item.Phone1, 'Phone2':item.Phone2,
                'Email': item.Email, 'lessThan100': item.lessThan100, 'lessThan1000': item.lessThan1000, 'moreThan1000':item.moreThan1000
              }
              }), searchedCaterer:[], sessionUser : req.session.user, userData: usrResult.map(item=>{
                return{
                  'FirstName': item.FirstName, 'LastName': item.LastName
                }
              })
            });
          }
        })
      }
    }
  })
  // connection.query('SELECT * from Users', function (error, results, fields) {
  //   if (error) 
  //     console.log('Error: ', error);
  //   console.log('The solution is: ', results[0].UserID);
  // });
 
  // connection.end();
  
});

/* POST HOME PAGE */

router.post('/', function(req,res){
  console.log('the req body is', req.body);
  let query = 'SELECT ct.* FROM CaterersHere.Caterers as ct, CaterersHere.CatererCities as city, CaterersHere.CatererCuisines as cs';
  query += ' where ct.Name like"%'+ req.body.search + '%"';
  if(Object.keys(req.body).indexOf('cities') !== -1){
    if(req.body.cities.length === 1){
      query += ' AND city.CityId in ('+ req.body.cities + ')';
    }
    else{
      query += ' AND city.CityId in ('+ req.body.cities.join(',') + ')';
    }
  }
  if(Object.keys(req.body).indexOf('cuisines') !== -1){
    if(req.body.cuisines.length === 1){
      query += ' AND cs.CuisineId in (' + req.body.cuisines + ')';
    }
    else{
      query += ' AND city.CityId in ('+ req.body.cuisines.join(',') + ')';
    }
    query += 'AND cs.CatererId = city.Caterersid AND ct.CatererId = cs.CatererId';
    console.log('Query::', query);
  }
  pool.query(query, function(err, Result){
    if(err){
      res.render('/', { isError: '', caterers:[], sessionUser : req.session.user, searchedCaterer:[]})
    }
    else{
      // console.log('results::', Result);
      // console.log('Query::', quer
      if(Object.keys(req.session).indexOf('user') !== -1){
        if(req.session.user.length > 0){
          pool.query('Select * from CaterersHere.Users where UserID=' + req.session.user.UserID, function(usrErr, usrResult){
            if(usrErr){
              res.render('index', {isError: true, caterers:[], sessionUser : req.session.user, searchedCaterer:[]})
            }
            else{
              var updatedInfo = Result.map(item =>{
                return{ 'CatererId': item.CatererId, 'Name': item.Name, 'Address': item.Address, 'Phone1': item.Phone1, 'Phone2':item.Phone2,
                  'Email': item.Email, 'lessThan100': item.lessThan100, 'lessThan1000': item.lessThan1000, 'moreThan1000':item.moreThan1000
                }
              })
              let distinct = [];
              updatedInfo.forEach((item)=>{
                let index = distinct.findIndex((x) => x.CatererId === item.CatererId);
                if(index === -1){
                  distinct.push(item);
                }
              })
              console.log('distinct::', distinct);
              console.log('the updated info is:', updatedInfo); 
              var uniqueArr = _.uniq(updatedInfo, function(x){ return x.id});
              console.log('the unique info is:', uniqueArr);
              res.render('index', { isError: '', caterers: [], searchedCaterer: distinct, sessionUser : req.session.user, 
              userData: usrResult.map(item=>{
                return{
                  "FirstName": item.FirstName, "LastName": item.LastName
                }
              })});
            }
          })
        }
        else{
          var updatedInfo = Result.map(item =>{
            return{ 'CatererId': item.CatererId, 'Name': item.Name, 'Address': item.Address, 'Phone1': item.Phone1, 'Phone2':item.Phone2,
              'Email': item.Email, 'lessThan100': item.lessThan100, 'lessThan1000': item.lessThan1000, 'moreThan1000':item.moreThan1000
            }
          })
          let distinct = [];
          updatedInfo.forEach((item)=>{
            let index = distinct.findIndex((x) => x.CatererId === item.CatererId);
            if(index === -1){
              distinct.push(item);
            }
          })
          console.log('distinct::', distinct);
          console.log('the updated info is:', updatedInfo); 
          var uniqueArr = _.uniq(updatedInfo, function(x){ return x.id});
          console.log('the unique info is:', uniqueArr);
          res.render('index', { isError: '', caterers: [], searchedCaterer: distinct, sessionUser : req.session.user, 
          userData: []
          });
        }
      }
      else{
        var updatedInfo = Result.map(item =>{
          return{ 'CatererId': item.CatererId, 'Name': item.Name, 'Address': item.Address, 'Phone1': item.Phone1, 'Phone2':item.Phone2,
            'Email': item.Email, 'lessThan100': item.lessThan100, 'lessThan1000': item.lessThan1000, 'moreThan1000':item.moreThan1000
          }
        })
        let distinct = [];
        updatedInfo.forEach((item)=>{
          let index = distinct.findIndex((x) => x.CatererId === item.CatererId);
          if(index === -1){
            distinct.push(item);
          }
        })
        console.log('distinct::', distinct);
        console.log('the updated info is:', updatedInfo); 
        var uniqueArr = _.uniq(updatedInfo, function(x){ return x.id});
        console.log('the unique info is:', uniqueArr);
        res.render('index', { isError: '', caterers: [], searchedCaterer: distinct, sessionUser : req.session.user, 
        userData: []
        });
      }
      
    }
  })
  
})

// Login
router.get('/login', function(req, res, next) {
  res.render('login', { message: '' });
});


// Get Register
router.get('/register', function(req, res, next) {
  res.render('register', {isError: false, message: '' });
});

// Post Register
router.post('/register', function(req, res, next) {
  pool.query('insert into Users (Email, Password, FirstName, Lastname, CreatedDate, ModifiedDate, ModifiedBy ) values("' + req.body.email + ' ", "' + req.body.password + '", "' + req.body.firstName + '", "' + req.body.lastName + '", CURTIME() , CURTIME() , null)', function (error, results, fields) {
    if(error){
      res.render('register', {
        isError : true
      })
    }
    else{
      res.render('register', { isError : false , message : 'Registered Successfully'})
    }  
  })
});

// Post Login
router.post('/login', (req, res, next) => {
  pool.query('Select * from Users WHERE email="'+ req.body.email+'" AND password="' + req.body.password +'"',function(error,results,fields){
    if(error){
      res.render('login',{ isError : true, message : ' Error occurred'});
    }
    else{
      result = results.map( item => { return{ UserID: item.UserID, Email: item.Email, Password : item.Password,
        FirstName: item.FirstName, LastName: item.LastName}});
        

        //console.log('the results are:', result);
      if(result.length > 0){
        req.session.user = result[0];
        //if(req.session.user)
        console.log('SESSION :: ', req.session);
        //console.log('results after login are:', result);
          res.redirect('/customerhistory');
      }
      else{
        res.render('login', { message: 'The details entered is incorrect'});
      }
    }
  })
});

//GET METHOD OF THE CATERER HOME PAGE
router.get('/catererhome', function(req, res, next){
  res.render('catererhome', {isError: false, message:''})
})
//POST METHOD OF CATERER HOME PAGE
router.post('/catererhome', function(req, res, next){
  
  pool.query('Select * from CaterersHere.Caterers where Email="' + req.body.email + '"AND password="' + req.body.password + '"', function(catererLoginErr, success){
    if(catererLoginErr){
      console.log('teh error is :', catererLoginErr);
    }
    else{

      if(success.length > 0){
        result = success.map(item => {
          return{ 
            id: item.CatererId, 
            Name: item.Name
          }});  
          req.session.Caterer = result[0];
          //req.session.save();
          console.log('the session is::', req.session);
          if(req.session.Caterer)
            res.redirect('catererdashboard');   
          else{
            console.log('thhe session undefined');
          }
      }
      else{
        res.render('catererhome', {isError: true, message: 'The details entered are incorrect'});
      }
    }
  })
})

//GET METHOD OF THE CATERER DASHBORD/ LOGIN PAGE

router.get('/catererdashboard', function(req,res, next){
  //console.log('Caterer : ', req.session);
  pool.query('Select * from CaterersHere.Caterers WHERE CatererId=' + req.session.Caterer.id , function(err, Result){
    if(err){
      res.render('catererdashboard', {isError: '',  Caterer: {}})
    }
    else{
      let query = 'SELECT  co.OrderId,cp.PackageName, co.EventDate, co.Event, co.Address,co.Peoples, co.Inquiry, co.UserId, us.Email, us.FirstName, us.LastName FROM CaterersHere.Orders as co , CaterersHere.Packages as cp, CaterersHere.Users as us  where co.UserId = us.UserID AND co.Package = cp.PackageId AND co.CatererId = ' + req.session.Caterer.id ;
      console.log(query);
      pool.query(query, function(orderErr, orderResult){
        if(orderErr){
          console.log('orderErr', orderErr);
          res.render('catererorder', {isError: true, Caterer: []})
        }
        else{
          let orderList = orderResult.map(item =>{
            return{ 'OrderId': item.OrderId, 'EventDate': item.EventDate, 'Address': item.Address, 'PackageName': item.PackageName, 'Inquiry':item.Inquiry,
              'Event': item.Event, 'lessThan100': item.lessThan100, 'lessThan1000': item.lessThan1000, 'moreThan1000':item.moreThan1000, 'UserId': item.UserId, 'Email': item.Email,
              'FirstName': item.FirstName, 'LastName': item.LastName
            }
          })
          console.log('orderResult:::', orderList);
          console.log('CAterer::', Result);
  
          res.render('catererdashboard', {isError: false, 
            Caterer: Result.map(item =>{
              return{ 'CatererId': item.CatererId, 'Name': item.Name, 'Address': item.Address, 'Phone1': item.Phone1, 'Phone2':item.Phone2,
                'Email': item.Email, 'lessThan100': item.lessThan100, 'lessThan1000': item.lessThan1000, 'moreThan1000':item.moreThan1000
              }
            }),
            orderList : orderResult.map(item =>{
              return{ 'OrderId': item.OrderId, 'EventDate': item.EventDate, 'Address': item.Address, 'PackageName': item.PackageName, 'Inquiry':item.Inquiry,
                'Event': item.Event, 'lessThan100': item.lessThan100, 'lessThan1000': item.lessThan1000, 'moreThan1000':item.moreThan1000, 'UserId': item.UserId, 'Email': item.Email,
                'FirstName': item.FirstName, 'LastName': item.LastName
              }
            }),
          })
        }
      })
    }
  })
})
//GET METHOD FOR CATERER ORDER

router.get('/catererorder', function(req, res, next){
  //res.render('catererorder', {isError: true, message: '', Caterer: req.session.Caterer})
  pool.query('Select * from CaterersHere.Caterers WHERE CatererId=' + req.session.Caterer.id , function(err, Result){
    if(err){
      res.render('catererorder', {isError: true, Caterer: []})
    }
    else{
      let query = 'SELECT  co.OrderId,cp.PackageName, co.EventDate, co.Event, co.Address,co.Peoples, co.Inquiry, co.UserId, us.Email, us.FirstName, us.LastName FROM CaterersHere.Orders as co , CaterersHere.Packages as cp, CaterersHere.Users as us  where co.UserId = us.UserID AND co.Package = cp.PackageId AND co.CatererId = ' + req.session.Caterer.id ;
      pool.query(query, function(orderErr, orderResult){
        if(orderErr){
          console.log('orderErr');
          res.render('catererorder', {isError: true, Caterer: []})
        }
        else{
          let orderList = orderResult.map(item =>{
            return{ 'OrderId': item.OrderId, 'EventDate': item.EventDate, 'Address': item.Address, 'PackageName': item.PackageName, 'Inquiry':item.Inquiry,
              'Event': item.Event, 'Peoples': item.Peoples,'UserId': item.UserId, 'Email': item.Email,
              'FirstName': item.FirstName, 'LastName': item.LastName
            }
          })
          console.log('orderResult:::', orderList);
          /* console.log('order Result::', orderResult); */
          res.render('catererorder', {isError: false, 
            Caterer: Result.map(item =>{
              return{ 'CatererId': item.CatererId, 'Name': item.Name, 'Address': item.Address, 'Phone1': item.Phone1, 'Phone2':item.Phone2,
                'Email': item.Email, 'lessThan100': item.lessThan100, 'lessThan1000': item.lessThan1000, 'moreThan1000':item.moreThan1000
              }
            }),
            orderList : orderResult.map(item =>{
              return{ 'OrderId': item.OrderId, 'EventDate': new Date(item.EventDate).toDateString(), 'Address': item.Address, 'PackageName': item.PackageName, 'Inquiry':item.Inquiry,
                'Event': item.Event,'Peoples': item.Peoples, 'UserId': item.UserId, 'Email': item.Email,
                'FirstName': item.FirstName, 'LastName': item.LastName
              }
            })
          })
        }
      })
      
      //res.render('catererorder', {isError: true, message='', Caterer: req.session.Caterer})
    }
  });
});

//GET METHOD FOR CATERER PROFILE  

router.get('/catererprofile', function(req, res, next){
  console.log('session : ', req.session.Caterer);
  pool.query('Select * from CaterersHere.Caterers WHERE CatererId=' + req.session.Caterer.id , function(err, Result){
    if(err){
      res.render('catererprofile', {isError: true, Caterer: []})
    }
    else{
      res.render('catererprofile', {isError: false, 
        Caterer: Result.map(item =>{
          return{ 'CatererId': item.CatererId, 'Name': item.Name, 'Address': item.Address, 'Phone1': item.Phone1, 'Phone2':item.Phone2,
            'Email': item.Email, 'lessThan100': item.lessThan100, 'lessThan1000': item.lessThan1000, 'moreThan1000':item.moreThan1000
          }
        })
      });
    }
  })
  
});

/* GET METHOD FOR CATERER PROFILE EDIT */

router.get('/catererprofileEdit', function(req, res, next){
  pool.query('SELECT * FROM CaterersHere.Cities', function (error, results) {
    if (error) {
      res.render('catererprofileEdit', {
        isError: true,  
        message:''
      })
    }
    else{
      pool.query('SELECT * FROM CaterersHere.Cuisines', function (cuisinesError, cuisinesResult) {
        if(cuisinesError) {
          res.render('catererprofileEdit', {
            isError: true,
            message:''
          })
        }
        else{
          pool.query('SELECT * FROM CaterersHere.CatererPackages WHERE CatererId="' + req.session.Caterer.id + '"', function (Error, Result) {
            if(Error){
              res.render('catererprofileEdit', {
                isError: true,
                message:''
              })
            }
            else{
              pool.query('Select * from CaterersHere.CatererCities WHERE CaterersId="' + req.session.Caterer.id + '"', function(err, cityResult){
                if(err){
                  res.render('catererprofileEdit', {
                    isError: true,
                    message:''
                  })
                }
                else{
                  pool.query('Select * from CaterersHere.CatererCuisines WHERE CatererId="' + req.session.Caterer.id + '"', function(Cuisineerr, cuisineResult){
                    if(Cuisineerr){
                      res.render('catererprofileEdit', {
                        isError: true,
                        message:''
                      })
                    }
                    else{ 
                      pool.query('Select * from CaterersHere.Caterers WHERE CatererId=' + req.session.Caterer.id , function(catererErr, catererResult){
                        if(catererErr){
                          res.render('catererprofileEdit', {
                            isError: true,
                            message:''
                          })
                        }
                        else{
                          pool.query('select * from uploads WHERE CatererId=' + req.session.Caterer.id, function(fileError, fileResult) {
                            if(fileError){
                              res.render('catererprofileEdit', {
                                isError: true,
                                message:''
                              })
                            }
                            else{
                              res.render('catererprofileEdit', {
                                isError: false,
                                message: '',
                                cities: results.map(item => {
                                  return { 'CityId': item.CityId, 'CityName': item.CityName }
                                }),
                                cuisines: cuisinesResult.map(item => {
                                  return { 'CuisinesId': item.CuisinesId, 'CusineName': item.CusineName }
                                }),
                                packages: Result.map(item => {
                                  return{ 'PackageId': item.PackageId, 'Price': item.Price}
                                }),
                                catererCities: cityResult.map(item => {
                                  return{ 'CityId': item.CityId}
                                }),
                                catererCuisines: cuisineResult.map(item => {
                                  return{'CuisineId': item.CuisineId}
                                }),
                                files: fileResult.map(item => {
                                  return { 'fileName': item.Name , 'id': item.UploadId}
                                }),
                                Caterer: catererResult.map(item =>{
                                  return{ 'CatererId': item.CatererId, 'Name': item.Name, 'Address': item.Address, 'Phone1': item.Phone1, 'Phone2':item.Phone2,
                                    'Email': item.Email, 'lessThan100': item.lessThan100, 'lessThan1000': item.lessThan1000, 'moreThan1000':item.moreThan1000
                                  }
                                })
                              })
                            }
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      }) 
    }     
  })        
});

router.get('/deletefile', function(req,res) {
  pool.query('delete from CaterersHere.uploads WHERE UploadId=' + req.query.id , function(err, Result){
    if(err){
      res.send({'success': false});
    }
    else{
      res.send({'success': true});
    }
  })
});
// POST METHOD FOR PROFILE EDIT
router.post('/catererprofileEdit', upload.array('photos', 12), function(req, res){
  console.log('Photos : ', req.files);
  /* req.files.forEach(item => {
    console.log(item.filename);
  }); */
    
  var query = 'Update CaterersHere.Caterers SET Name="' + req.body.Name + '", Address="' + req.body.Address + '", Phone1="' + req.body.Phone1 + '", Phone2="' + req.body.Phone2 + '", lessThan100="'+ (req.body.lessThan100? "ON" : "") + '", lessThan1000="'+ (req.body.lessThan1000 ? "ON" : "") + '", moreThan1000="'+ (req.body.moreThan1000 ? "ON" : "") + '" WHERE CatererId=' + req.session.Caterer.id;
  /* console.log('Query : ', query); */
  pool.query(query, function(caterererror, catererResult){
    if(caterererror){
      console.log('caterererror');
      res.render('catererprofileEdit', {
        isError: true,
        message:'',
        Caterer: []
      })
    }
    else{
      let query = 'Update CaterersHere.CatererPackages SET Price=(case when PackageId="1" then"' + req.body.Silver +
                  '" when PackageId="2" then"' + req.body.Gold + '" when PackageId="3" then"' + req.body.Platinum + '" end) where PackageId in ("1", "2", "3") AND CatererId="'+ req.session.Caterer.id + '"';
      /* console.log('the package update is:', query); */
      pool.query(query, function(packErr, packResult){
        if(packErr){
          console.log('packErr');
          res.render('catererprofileEdit', {
            isError: true,
            message:'',
            Caterer: []
          })
        }
        else{
          /* pool.query('Select * from CaterersHere.CatererCities where CaterersId=' + req.body.Caterer.id, function(selectErr, selectRes){
            if(selectErr){
              res.render('catererprofileEdit', {
                isError: true,
                message:'',
                Caterer: []
              })
            }
            else{ */
              pool.query('DELETE from CaterersHere.CatererCities where CaterersId=' + req.session.Caterer.id, function(delCityErr, delCityResult){
                if(delCityErr){
                  console.log('delCityErr');
                  res.render('catererprofileEdit', {
                    isError: true,
                    message:'',
                    Caterer: []
                  })
                }
                else{
                  pool.query('DELETE from CaterersHere.CatererCuisines where CatererId=' + req.session.Caterer.id, function(delCuisinesErr, delCuisinesResult){
                    if(delCuisinesErr){
                      console.log('delCuisinesErr');
                      res.render('catererprofileEdit', {
                        isError: true,
                        message:'',
                        Caterer: []
                      })
                    }
                    else{
                      let cityValues = [];
                      req.body.multiCity.forEach(item => {
                        cityValues.push( '(' + req.session.Caterer.id + ',' + item + ')');
                        
                      })
                      console.log('the city values:', cityValues);
                      console.log('the query:', )
                      pool.query('insert into CatererCities(CaterersId, CityId) values' + cityValues.join(','), function(insertCityErr, insertCityResult){
                        if(insertCityErr){
                          
                          console.log('insertCityErr');
                          res.render('catererprofileEdit', {
                            isError: true,
                            message:'',
                            Caterer: []
                          })
                        }
                        else{
                          console.log('the val:',req.body.multiCuisines);
                          let cuisineValues = [];
                          req.body.multiCuisines.forEach(item => {
                            cuisineValues.push( '(' + req.session.Caterer.id + ',' + item + ')');

                          })
                          pool.query('insert into CatererCuisines(CatererId, CuisineId) values'+ cuisineValues.join(','), function(insertCuisineErr, insertCuisineResult){
                            if(insertCuisineErr){
                              console.log('insertCuisineErr');
                              res.render('catererprofileEdit', {
                                isError: true,
                                message:'',
                                Caterer: []
                              })
                            }
                            else{
                              var photoList = [];
                              console.log('the files are', req.files);
                              req.files.forEach(item => {
                                photoList.push("('" + item.filename + "'," + req.session.Caterer.id + ')');
                              })
                              if(req.files.length > 0){
                                let query = 'Insert into CaterersHere.Uploads(Name,CatererId) values' + photoList.join(',');
                                console.log(query);

                                pool.query(query, function(uppErr, uppResult){
                                  if(uppErr){
                                    console.log('uppErr');
                                    res.render('catererprofileEdit', {
                                      isError: true,
                                      message:'',
                                      Caterer: []
                                    })
                                  }
                                  else{
                                    console.log('the del result', insertCuisineResult);
                                    res.redirect('/catererprofile');
                                  }
                                }) 
                              }
                              else{
                                res.redirect('/catererprofile');
                              }     
                            }
                          })
                        }
                      })
                      /* console.log('the multiselec values are:', req.body.multiCity); */
                      
                    }
                  })
                }
              }) 
        }
      })
      
    }
  })
})
/* GET METHOD FOR CUSTOMER HOME PAGE */
router.get('/customerhome', function(req, res, next){
  req.session.user = [];
  console.log('the session in the get method of customer home is:', req.session);
  res.render('customerhome', { message: ''});
})

/* POST METHOD FOR CUSTOMER HOME PAGE */

router.post('/customerhome', function(req, res){
  pool.query('Select * from Users WHERE email="'+ req.body.email+'" AND password="' + req.body.password +'"',function(error,results,fields){
    if(error){
      console.log('err');
      res.render('customerhome',{ isError : true, message : ' Error occurred'});
    }
    else{
      result = results.map( item => { return{ UserID: item.UserID, 
        FirstName: item.FirstName}});
        

        console.log('the results are:', result);
      if(result.length > 0){
        req.session.user = result[0];
        //if(req.session.user)
        console.log('SESSION :: ', req.session);
        //console.log('results after login are:', result);
          res.redirect('/');
      }
      else{
        res.render('customerhome', { message: 'The details  incorrect'});
      }
    }
  })
})
// GET CATERER REGISTRATION PAGE
router.get('/catererReg', function(req, res, next){
 
  pool.query('SELECT * FROM CaterersHere.Cities', function (cityerror, cityresults) {
   if (cityerror) {
     res.render('catererReg', {
       isError: true,
       message:''
     })
   }
   else{
     pool.query('SELECT * FROM CaterersHere.Cuisines', function (cuisinesError, cuisinesResult) {
       if(cuisinesError) {
         res.render('catererReg', {
           isError: true,
           message:''
         })
       }
       else{
         pool.query('SELECT * FROM CaterersHere.Packages', function(packagesError, packagesResult){
           if(packagesError){
             res.render('catererReg', { isError: true, message: ''})
           }
           else{
             
             res.render('catererReg', {
               isError: false,
               message: '',
               cities: cityresults.map(item => {
                 return { 'CityId': item.CityId, 'CityName': item.CityName }
               }),
               cuisines: cuisinesResult.map(item => {
                 return { 'CuisinesId': item.CuisinesId, 'CusineName': item.CusineName }
               }),
               packages: packagesResult.map(item => {
                 return { 'PackageId': item.PackageId, 'PackageName': item.PackageName}
               })
             })
           }
         })
       }
     })
   }
 });
   
 })
//Post values in caterer registration

router.post('/catererReg', function(req, res, next){
  console.log('insert into Caterers(Name, Password, ConfirmPassword, Address, Phone1, Phone2, Email, lessThan100, lessThan1000, moreThan1000, Description) values("' + req.body.Name + '","' + req.body.Password + '","' + req.body.ConfirmPassword + '","' + req.body.Address + '","' + req.body.Phone1 + '","' + req.body.Phone2 + '","' + req.body.Email + '","'+ req.body.lessThan100 + '","' + req.body.lessThan1000 + '","' + req.body.moreThan1000 + '","' + req.body.description + '")');
  pool.query('insert into Caterers(Name, Password, ConfirmPassword, Address, Phone1, Phone2, Email, lessThan100, lessThan1000, moreThan1000, Description) values("' + req.body.Name + '","' + req.body.Password + '","' + req.body.ConfirmPassword + '","' + req.body.Address + '","' + req.body.Phone1 + '","' + req.body.Phone2 + '","' + req.body.Email + '","'+ req.body.lessThan100 + '","' + req.body.lessThan1000 + '","' + req.body.moreThan1000 + '","' + req.body.description + '")',function(regError, regResults){
    if(regError){
      console.log('caterer err');
      res.render('catererReg', {isError: true, message: 'fail'});
      //console.log('error!!',error);
    }
    else{
      var citiesValues = [];
      console.log('the cit values are:', req.body.cityMulti)
      req.body.cityMulti.forEach(item => {
        citiesValues.push('(' + regResults.insertId  + ',' + item + ')');
        
      })
      pool.query('insert into CatererCities(CaterersId, CityId) values' + citiesValues.join(','),function(catCitiesErr, catCitiesResult){
        if(catCitiesErr){
          res.render('catererReg', {isError: true, message: 'failed'});
          //console.log('error');
          console.log('cat city err');
        }
        else{
          var cuisinesValues = [];
          req.body.cuisineMulti.forEach(item => {
            cuisinesValues.push( '(' + item + ',' + regResults.insertId + ')');
            
          })
          pool.query('insert into CatererCuisines(CuisineId, CatererId) values' + cuisinesValues.join(','),function(catCuisineErr, catCuisineResult){
            if(catCuisineErr){
              res.render('catererReg', {isError: true, message: 'failed'});
              //console.log('erroR',error);
              console.log('catcuisine err');
            }
            else{
              var packagesValues = [];
              req.body.Price.forEach((item,index) => {
                packagesValues.push('(' + regResults.insertId + ',' + (index+1) + ',' + item + ')')
              })
              pool.query('insert into CaterersHere.CatererPackages(CatererId, PackageId, Price) values' + packagesValues.join(','), function(catPackErr, catPackResult){
                if(catPackErr){
                  res.render('catererReg', {isError: true, message: 'failed'});
                  //console.log('error', err);
                  console.log('catPack er');
                }
                else{
                  pool.query('SELECT * FROM CaterersHere.Cities', function (cityerror, cityresults) {
                    if (cityerror) {
                      res.render('catererReg', {
                        isError: true,
                        message:''
                      })
                      console.log('city err');
                    }
                    else{
                      pool.query('SELECT * FROM CaterersHere.Cuisines', function (cuisinesError, cuisinesResult) {
                        if(cuisinesError) {
                          res.render('catererReg', {
                            isError: true,
                            message:''
                          })
                          console.log('cuisine err');
                        }
                        else{
                          pool.query('SELECT * FROM CaterersHere.Packages', function(packagesError, packagesResult){
                            if(packagesError){
                              res.render('catererReg', { isError: true, message: ''})
                              console.log('packages err');
                            }
                            else{
                              res.render('catererReg', {
                                isError: false,
                                message: 'Success',
                                cities: cityresults.map(item => {
                                  return { 'CityId': item.CityId, 'CityName': item.CityName }
                                }),
                                cuisines: cuisinesResult.map(item => {
                                  return { 'CuisinesId': item.CuisinesId, 'CusineName': item.CusineName }
                                }),
                                packages: packagesResult.map(item => {
                                  return { 'PackageId': item.PackageId, 'PackageName': item.PackageName}
                                })
                              })
                            }
                          })
                        }
                      })
                    }
                  });
                }  
              })
            }
          })
        }
      });
    }
  })
});
// Create HTML for Caterer registration
// Bind dynamic values  
// Post values in Backend - Print in console
// Create insert queries for each table 
//
//GET METHOD FOR BOOKING DETAILS
router.get('/bookingDetails',function(req, res, next){
  var data = {
    catererName: '',
    priceList: []
  };
  pool.query('SELECT * FROM CaterersHere.Caterers as cc, CaterersHere.CatererPackages as cp where cp.CatererId = cc.CatererId and cc.CatererId = ' + req.query.cid, function(err, result){
    if(err){
      //console.log('error', err);
      res.render('bookingDetails', { isError: true, message: 'Internal Server Error!', data: ''});
    }
    else{
      if(result.length > 0){
        var packages = ['Silver', 'Gold', 'Platinum'];
        data.catererName = result[0].Name;
        data.catererID = req.query.cid;
        result.forEach((item, index) => {
          data.priceList.push({
            packagePrice: item.Price,
            packageID: item.PackageId,
            displayText:  packages[index] + ' (' + item.Price + ' / Dish)'
          });
        })
        res.render('bookingDetails', { isError: false, message: '', data: data, CatererId: req.query.cid, Name: req.query.cname});
      }
      else{
        res.render('bookingDetails', { isError: false, message: '', data: '', CatererId: req.query.cid, Name: req.query.cname});
      }
    }
  })
  
});
//POST METHOD FOR BOOKING DETAILS
router.post('/bookingDetails', function(req, res, next){
  //console.log('insert into CaterersHere.Orders(EventDate, Package, Inquiry, lessThan100, Event, CatererId, UserId, Address) values("' + req.body.EventDate + '","' + req.body.Package + '","' + req.body.Inquiry + '","' + req.body.guests + '","' + req.body.Event + '","' + req.body.catererID + '","' + userid + '","' + req.body.Address + '")') 
  pool.query('insert into CaterersHere.Orders(EventDate, Package, Inquiry, lessThan100, Event, CatererId, UserId, Address) values("' + req.body.EventDate + '","' + req.body.Package + '","' + req.body.Inquiry + '","' + req.body.guests + '","' + req.body.Event + '","' + req.body.catererID + '","' + userid + '","' + req.body.Address + '")', function(error, orderResult){
    if(error){
      //console.log('error', error);
      res.redirect('/?msg=Error');
    }
    else{
      //console.log('order Placed');
      res.redirect('/msg=Order Booked');
    }
  })
});



// GET METHOD FOR CATERER PAGE
router.get('/catererpage', function(req, res, next){
  console.log('the querry params are:', req.query);
  let query = 'Select * from CaterersHere.Caterers where CatererId=' + req.query.cid;
  pool.query(query, function(catererErr, catererResult){
    if(catererErr){
      res.render('error', {CatererId: req.query.cid, Name: req.query.cname, catererInfo: [], message: 'catererErr', cities:[], cuisines: [], error:{stack:[], status: true}})
    }
    else{
      let query = 'select  cc.CatererCityId, cc.CityId, cc.CaterersId, city.CityName from CaterersHere.CatererCities as cc, CaterersHere.Cities as city, CaterersHere.Caterers as cat where cc.CityId = city.CityId AND cc.CaterersId = cat.CatererId AND cat.CatererId=' + req.query.cid;
      pool.query(query, function(cityErr, cityResult){
        if(cityErr){
          res.render('error', {CatererId: req.query.cid, Name: req.query.cname, catererInfo: [], message: 'cityErr', error:{stack:[], status: true}})
        }
        else{
          let query = 'select  cc.CatererCuisinesId, cc.CuisineId, cc.CatererId, cuisine.CusineName from CaterersHere.CatererCuisines as cc, CaterersHere.Cuisines as cuisine, CaterersHere.Caterers as cat where cc.CuisineId = cuisine.CuisinesId AND cc.CatererId = cat.CatererId AND cat.CatererId =' + req.query.cid;
          pool.query(query, function(cuisineErr, cuisineResult){
            if(cuisineErr){
              res.render('error', {CatererId: req.query.cid, Name: req.query.cname, catererInfo: [], message: 'cuisineErr', error:{stack:[], status: true}})
            }
            else{
              console.log('City:', cityResult,'cuisine::', cuisineResult);
              res.render('catererpage',{ CatererId: req.query.cid, Name: req.query.cname, message: '',
                catererInfo: catererResult.map( item => {
                  return{
                    Description: item.Description, Address: item.Address
                  }
                }),
                cities: cityResult.map(item => {
                  return{
                    CityName: item.CityName
                  }
                }),
                cuisines: cuisineResult.map(item => {
                  return{
                    CuisineName: item.CusineName
                  }
                })
              });
            }
          })
        }
      })
    }
  })
});
/* GET METHOD FOR MENU PAGE */
router.get('/caterermenu', function(req, res){
  pool.query('Select * from Uploads Where CatererId=' + req.query.cid, function(uploadErr, UploadResult){
    if(uploadErr){
      res.render('error', {error:{status: true, stack:[]}, message:'uploadErr',CatererId: [], Name: ''})
    }
    else{
      console.log('the upload result is:', UploadResult);
      res.render('caterermenu', {error:{status: false, stack:[]}, message:'successfull',
      CatererId: req.query.cid, Name: req.query.cname,
      uploadInfo: UploadResult.map(item => {
        return{
          Name: item.Name
        }
      })
      });
    }
  })
})

/* GET METHOD FOR CONTACT PAGE */
router.get('/caterercall', function(req, res){
  query = "select Phone1, Phone2, Email from CaterersHere.Caterers where CatererId=" + req.query.cid;
  pool.query(query, function(contactErr, contactResult){
    if(contactErr){
      res.render('error', {CatererId: req.query.cid, Name: req.query.cname, catererInfo: [], message: 'cuisineErr', error:{stack:[], status: true}});
    }
    else{
      res.render('caterercall', {error:{status: false, stack:[]}, message:'successfull',
      CatererId: req.query.cid, Name: req.query.cname,
      contactInfo: contactResult.map(item => {
        return{
          Phone1: item.Phone1, Phone2: item.Phone2, Email: item.Email
        }
      })
      });
    }
  }) 
  
})

/* GET METHOD FOR CATERER BOOKING */
router.get('/catererbook', function(req, res){
  console.log('the session catererBOok is:', req.session);
  var data = {
    catererName: '',
    priceList: []
  };
  let sessionusr = req.session;
  console.log('catererBook val:', Object.keys(sessionusr).indexOf('user'));
  pool.query('SELECT * FROM CaterersHere.Caterers as cc, CaterersHere.CatererPackages as cp where cp.CatererId = cc.CatererId and cc.CatererId = ' + req.query.cid, function(err, result){
    if(err){
      console.log('error', err);
      res.render('catererbook', { isError: true, message: 'Internal Server Error!', data: ''});
    }
    else{
      if(result.length > 0){
        var packages = ['Silver', 'Gold', 'Platinum'];
        data.catererName = result[0].Name;
        data.catererID = req.query.cid;
        result.forEach((item, index) => {
          data.priceList.push({
            packagePrice: item.Price,
            packageID: item.PackageId,
            displayText:  packages[index] + ' (' + item.Price + ' / Dish)'
          });
        })
        res.render('catererbook', { error:{status: false, stack:[]}, message: '', data: data, CatererId: req.query.cid, Name: req.query.cname,
        sessionUser : req.session          
        });
      }
      else{
        res.render('catererbook', { error:{status: false, stack:[]}, message: '', data: '', CatererId: req.query.cid, Name: req.query.cname,
        sessionUser : req.session 
        });
      }
    }
  })
})

/* POST METHOD FOR CATERER BOOKING */

router.post('/catererbook', function(req, res, next){
  console.log('insert into CaterersHere.Orders(EventDate, Package, Inquiry, Peoples, Event, CatererId, UserId, Address) values("' + req.body.EventDate + '","' + req.body.Package + '","' + req.body.Inquiry + '","' + req.body.Guests + '","' + req.body.Event + '","' + req.body.catererID + '","' + req.session.user.UserID + '","' + req.body.Address + '")') 
  pool.query('insert into CaterersHere.Orders(EventDate, Package, Inquiry, Peoples, Event, CatererId, UserId, Address) values("' + req.body.EventDate + '","' + req.body.Package + '","' + req.body.Inquiry + '","' + req.body.Guests + '","' + req.body.Event + '","' + req.body.catererID + '","' + req.session.user.UserID + '","' + req.body.Address + '")', function(error, orderResult){
    if(error){
      console.log('error', error);
      res.render('error', { error:{status: true, stack:[]}, message: 'Some error Occured', CatererId: req.query.cid, Name: req.query.cname});
    }
    else{
      //console.log('order Placed');
      res.render('catererbook', { error:{status: true, stack:[]}, message: 'Successfull',
       CatererId: req.query.cid, Name: req.query.cname,  sessionUser : req.session});
    }
  })
});

//GET METHOD FOR DEMO PAGE
router.get('/demo', function(req, res){
  res.render('demo', { message: 'welcome'});
});

/* GET METHOD FOR CUSTOMER HISTORY */
router.get('/customerhistory', function(req, res){
  console.log('the sesion is:', req.session);
  let query = 'SELECT  co.OrderId,cp.PackageName, co.EventDate, co.Event, co.Address,co.Peoples, co.Inquiry, co.CatererId, us.Email, us.FirstName, us.LastName, cc.Name FROM CaterersHere.Orders as co , CaterersHere.Packages as cp, CaterersHere.Users as us, CaterersHere.Caterers as cc where co.CatererId = cc.CatererId AND co.Package = cp.PackageId AND co.UserId = us.UserID AND us.UserId =' + req.session.user.UserID;
  pool.query(query, function(historyErr, historyResult){
    if(historyErr){
      console.log('user error');
      res.render('customerhistory', {isError: true})
    }
    else{
      pool.query('Select * from CaterersHere.Users WHERE UserID=' + req.session.user.UserID, function(usrErr, usrResult){
        if(usrErr){
          console.log('he usr err:', usrErr);
          res.render('customerprofile', {isError: true});
        }
        else{
          console.log('the usrResult is:', usrResult);
          console.log('the history::',historyResult)
          res.render('customerhistory', {isError: false, 
            history: historyResult.map(item => {
              return{
                'CatererName': item.Name, 'Package': item.PackageName, 'EventDate': new Date(item.EventDate).toDateString(), 'Inquiry': item.Inquiry,
                'Event': item.Event, 'Address': item.Address, Peoples: item.Peoples
              }
            }),
            userData: usrResult.map(item=>{
              return{
                FirstName: item.FirstName, LastName: item.LastName
              }
            }) 
          });
        }
      })
      
    }
  })
  
})

/* GET METHOD FOR PROFILE */
router.get('/customerprofile', function(req, res){
  pool.query('Select * from CaterersHere.Users WHERE UserID=' + req.session.user.UserID, function(usrErr, usrResult){
    if(usrErr){
      res.render('customerprofile', {isError: true});
    }
    else{
      console.log('User Results::', usrResult);
      res.render('customerprofile', {isError: false, 
        userData: usrResult.map(item=>{
          return{
            "FirstName": item.FirstName, "LastName": item.LastName, "Email": item.Email
          }
        }) 
      });
    }
  })
})

/* POST METHOD FOR PROFILE */

router.post('/customerprofile', function(req, res){
  if(req.body.password.length === 0){
    console.log('Update CaterersHere.Users SET FirstName="' + req.body.FN + '",LastName="' + req.body.LN + '",Email="' + req.body.email + '"Where UserID="' + req.session.user.UserID + '"');
    pool.query('Update CaterersHere.Users SET FirstName="' + req.body.FN + '",LastName="' + req.body.LN + '",Email="' + req.body.email + '"Where UserID="' + req.session.user.UserID + '"', function(withoutpassErr){
      if(withoutpassErr){
        console.log('without pass error occured');
        res.render('customerprofile', {isError: true});
      }
      else{
        pool.query('Select * from CaterersHere.Users WHERE UserID=' + req.session.user.UserID, function(usrErr, usrResult){
          if(usrErr){
            res.render('customerprofile', {isError: true});
          }
          else{
            console.log('User Results::', usrResult);
            res.render('customerprofile', {isError: false, 
              userData: usrResult.map(item=>{
                return{
                  "FirstName": item.FirstName, "LastName": item.LastName, "Email": item.Email
                }
              }) 
            });
          }
        })
      }
    })
  }
  else{
    console.log('WITHPASS', 'Update CaterersHere.Users SET FirstName="' + req.body.FN + '",LastName="' + req.body.LN + '",Email=' + req.body.email + '",Password=' + req.body.password + '"Where UserID="' + req.session.user.UserID + '"');
    pool.query('Update CaterersHere.Users SET FirstName="' + req.body.FN + '",LastName="' + req.body.LN + '",Email="' + req.body.email + '",Password="' + req.body.password + '"Where UserID="' + req.session.user.UserID + '"', function(withpassErr){
      if(withpassErr){
        res.render('customerprofile', {isError: true});
      }
      else{
        pool.query('Select * from CaterersHere.Users WHERE UserID=' + req.session.user.UserID, function(usrErr, usrResult){
          if(usrErr){
            res.render('customerprofile', {isError: true});
          }
          else{
            console.log('User Results::', usrResult);
            res.render('customerprofile', {isError: false, 
              userData: usrResult.map(item=>{
                return{
                  "FirstName": item.FirstName, "LastName": item.LastName, "Email": item.Email
                }
              }) 
            });
          }
        })
      }
    })
  }
})

/* Get Method FORGOT PASSWORD */
router.get('/forgot', function(req, res){
  res.render('forgot', {message: ''});
})

/* Post Method FORGOT PASSWORD */

router.post('/forgot', function(req, res){
  async.waterfall([
    function(done){
      crypto.randomBytes(20, function(err, buf){
        var token = buf.toString('hex');
        done(err, token);
        console.log('the token is:', token);
      });
    },
    function(token, done){
      console.log('the Email is:', req.body.email)
      let query = 'Select * from CaterersHere.Users where Email="' + req.body.email + '"';
      pool.query(query, function(usrErr, usr){
        if(usrErr){
          console.log('the erris:', usrErr);
          res.render('error', {error:{ stack:[], status: 'true'}, message:'Error occured in getting the user data'})
        }
        else{
          console.log('the result is:', usr);
          if(usr.length > 0){
            // 1hour
            pool.query('Update CaterersHere.Users SET resetPasswordToken="' + token + '"where UserID="' + usr[0].UserID + '"', function(err){
              if(err){
                console.log('update err', err);
                res.render('error', {error: {stack: [], status:'true'}, message:'update Err'});
              }
              else{
                res.render('forgot', {message: ''});
                done(err, token, usr);
              }
            })
            
          /*   usr.save(function(err){
              done(err, token, usr);
            }) */
          }
          else{
            res.render('forgot', {message: 'Sorry your Email doesnt Exist'});
          }
        }
      })
    },
    function(token, usr, done){
      console.log('smtp function called');
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth:{
          user: 'purvamistry97@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: usr[0].Email,
        from: 'purvamistry97@gmail.com',
        subject: 'Reset password',
        text: 'you are receiving the mail..Please click on the following link to reset your password http://' + req.headers.host +
              '/reset/' + token + '.',
      }
      smtpTransport.sendMail(mailOptions, function(err){
        console.log('mail sent');
        
        done(err, 'done');
      })
    }
  ], function(err){
      if(err) return res.render('error', {error:{stack: [], status:'true'}, message:'this is the last err err'});
      else{
        return res.render('forgot', {message: 'the email has been sent to ' + usr[0].Email + ' with futher instructions'});
      }
      
    }
  )
})
module.exports = router;
