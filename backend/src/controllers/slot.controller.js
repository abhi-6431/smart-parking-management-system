const P=require('../models/parking.model'); const {validationResult}=require('express-validator'); const bad=(q,s)=>{const e=validationResult(q);if(!e.isEmpty()){s.status(422).json({message:'Validation failed',errors:e.array()});return true}return false};
async function list(req,res,next){try{res.json({slots:await P.listSlots(req.query)})}catch(e){next(e)}}
async function create(req,res,next){try{if(bad(req,res))return;res.status(201).json({slot:await P.createSlot(req.body)})}catch(e){next(e)}}
async function update(req,res,next){try{if(bad(req,res))return;const slot=await P.slotById(req.params.id);if(!slot)return res.status(404).json({message:'Slot not found.'});res.json({slot:await P.updateSlot(req.params.id,req.body)})}catch(e){next(e)}}
async function remove(req,res,next){try{await P.deleteSlot(req.params.id);res.status(204).end()}catch(e){next(e)}}
module.exports={list,create,update,remove};
