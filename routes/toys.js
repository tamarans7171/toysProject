const express = require("express");
const { auth, authAdmin } = require("../auth/authToken");
const { ToysModel, validateToy } = require("../models/toyModel");
const router = express.Router();

router.get("/", async (req, res) => {
  let perPage = 10;
  let page = req.query.page || 1;

  try {
    let data = await ToysModel.find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err });
  }
});

router.get("/id/:idGet", async (req, res) => {
  let perPage = 10;
  let page = req.query.page || 1;

  try {
    let id = req.params.idGet;
    let data = await ToysModel.findById(id)
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err });
  }
});

router.get("/search", async (req, res) => {
      let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;
    try {
    let queryS = req.query.s;

    let searchReg = new RegExp(queryS, "i");
    let data = await ToysModel.find({$or:[{name:searchReg},{info:searchReg}]})
    .limit(perPage)
    .skip((page - 1) * perPage)
    .sort({ _id: -1 });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err });
  }
});


router.get("/category/:catname", async (req, res) => {
  let perPage = 10;
  let page = req.query.page || 1;

  try {
    let queryCatName = req.query.catname;
    let catReg = new RegExp(queryCatName,"i")
    let data = await ToysModel.find({category:catReg})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err });
  }
});

router.get("/prices", async (req, res) => {
  let perPage = 10;
  let page = req.query.page || 1;

  try {
    let queryMin = req.query.min;
    let queryMax = req.query.max;
    // let catReg = new RegExp(queryCatName,"i")
    if(queryMax&&queryMin){
      let data = await ToysModel.find({price: { $gt: queryMin, $lt: queryMax }})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ price: 1 });
    res.json(data);
    }
    else if(queryMax){
      let data = await ToysModel.find({price: { $lt: queryMax }})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ price: 1 });
    res.json(data);
    }else if(queryMin){
      let data = await ToysModel.find({price: { $gt: queryMin }})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ price: 1 });
    res.json(data);
    }else{
      let data = await ToysModel.find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ price: 1 });
    res.json(data);
    }
   
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err });
  }
});

router.post("/", auth, async (req, res) => {
  let validBody = validateToy(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let toy = new ToysModel(req.body);
    toy.user_id = req.tokenData._id;
    await toy.save();
    res.status(201).json(toy);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err });
  }
});

router.put("/:editId", auth, async (req, res) => {
  let validBody = validateToy(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let editId = req.params.editId;
    let data;
    if (req.tokenData.role == "admin") {
      data = await ToysModel.updateOne({ _id: editId }, req.body);
    } else {
      data = await ToysModel.updateOne(
        { _id: editId, user_id: req.tokenData._id },
        req.body
      );
    }
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err });
  }
});

router.delete("/:delId", auth, async (req, res) => {
  try {
    let delId = req.params.delId;
    let data;
    if (req.tokenData.role == "admin") {
      data = await ToysModel.deleteOne({ _id: delId });
    } else {
      data = await ToysModel.deleteOne({
        _id: delId,
        user_id: req.tokenData._id,
      });
    }
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err });
  }
});

module.exports = router;
