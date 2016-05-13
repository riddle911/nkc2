//api content request handlers
module.paths.push(__projectroot + 'nkc_modules'); //enable require-ment for this path

var moment = require('moment')
var path = require('path')
var fs = require('fs.extra')
var settings = require('server_settings.js');
var helper_mod = require('helper.js')();

var async = require('async');

var express = require('express');
var api = express.Router();

var validation = require('validation');
var apifunc = require('api_functions');
var queryfunc = require('query_functions');

///------------
///something here to be executed before all handlers below
api.use(function(req,res,next){
  next();
});

//----
//counter increment api
if(development){
  api.get('/new/:countername',(req,res,next)=>{
    queryfunc.incr_counter(req.params.countername)
    .catch((err)=>{
      throw report(req.params.countername +' retrieval error',err);
    })
    .then(id=>{
      res.obj = id;
      next();
    })
    .catch(next);
  });
}

///----------------------------------------
///GET /posts/* handler
api.get('/post/:pid', function (req, res, next){
  //retrieve pid as parameter
  var pid=req.params.pid;

  //get the post from db
  apifunc.get_a_post(pid)
  .then(()=>{
    report(pid.toString()+' is hit');
    //var result=postRepack(body);
    res.obj = body;
    return next();
  })
  .catch(next)
});

///----------------------------------------
///GET /thread/* handler
api.get('/thread/:tid', function (req, res, next){
  apifunc.get_posts_from_thread_as_thread({
    tid:req.params.tid,
    start:req.query.start,
    count:req.query.count,
  })
  .then(result=>{
    res.obj = result;
    next();
  })
  .catch(next)
});

//GET /forum/*
api.get('/forum/:fid',(req,res,next)=>{
  apifunc.get_threads_from_forum_as_forum({
    fid:req.params.fid,
    start:req.query.start,
    count:req.query.count,
  })
  .then(data=>{
    res.obj = data;
    next();
  })
  .catch(next)
});

module.exports = api;