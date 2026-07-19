const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const { validationResult } = require('express-validator');
const fail = (req, res) => { const e=validationResult(req); if(!e.isEmpty()){res.status(422).json({message:'Validation failed',errors:e.array().map(x=>({field:x.path,message:x.msg}))});return true;} return false; };
async function profile(req,res,next){try{if(fail(req,res))return; const user=await User.updateProfile(req.user.id,req.body);res.json({message:'Profile updated',user});}catch(e){next(e)}}
async function password(req,res,next){try{if(fail(req,res))return;const user=await User.findByEmail(req.user.email);if(!await bcrypt.compare(req.body.currentPassword,user.password_hash))return res.status(400).json({message:'Current password is incorrect.'});await User.updatePassword(req.user.id,await bcrypt.hash(req.body.newPassword,12));res.json({message:'Password changed successfully.'});}catch(e){next(e)}}
module.exports={profile,password};
