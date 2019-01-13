import express from 'express';

// Set up the express app
const app = express();
const path = require('path');
const router = express.Router();

var fs = require("fs")

// get all todos
router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});
router.get('/get_data', (req, res) => {
  var db = JSON.parse(fs.readFileSync('../microsoft.json'));
  var experience ={
    "Positive Experience":0,
    "Negative Experience":0,
    "Neutral Experience":0
  }
  var offerDeclineDueToKnowIssue={
    "management":0,
    "behavioral":0,
    "other":0
  };
  var issues ={
    "Positive Experience":{
      "management":0,
      "behavioral":0,
      "other":0
    },
    "Negative Experience":{
      "management":0,
      "behavioral":0,
      "other":0
    },
    "Neutral Experience":{
      "management":0,
      "behavioral":0,
      "other":0
    }


  }

  for(var i=0;i<db.length;i++){
    if(experience[db[i].experience]!=undefined){
      experience[db[i].experience]++;
    }

    db[i]['issue'] = {
      "management":false,
      "behavioral":false
    }

      var patt1 = /((((job|position|opening|vacency)[\w\s]*(Filled))|(no (job|position|opening|vacency)[\w\s]*(left)))|(((n't|no|not)[\w\s]*(basis|meaning|sense)))|((n't|not|no)[\w\s]*(communicate|hear|reply|response|mail|answer|respond|excited)|delayed|waiting|waited for|((has been|more than)[\w\s\d\.]*(week|month)))|(mix-up|mixup)|((disappointed|not statisfied|complicated|worst)[\w\s]*(process|system|flow|schedule|experience)))/ig;
      var result1 = patt1.test(db[i].details);

      if(result1){
        db[i]['issue'].management = true;
        if(db[i].gotOffer == 'Declined Offer'){
          offerDeclineDueToKnowIssue.management++;
        }
        if(issues[db[i].experience]!=undefined){
        issues[db[i].experience].management++;
        }
      }
      var patt2 = /((rude|unprofessional|unpleasant|apathetic)|((interviewer|people|panel|sir|mam|madam|lady)[\w\s]*(yawn|sleep|tired|unattent|uninterest))|((zero|no|n't|lost|worst|not)[\w\s]*(respect|manner|interest|behaviour|attention|polite|edicate|responsive|talk)))/ig;
      var result2 = patt2.test(db[i].details);
      if(result2){
        db[i]['issue'].behavioral = true;
        if(issues[db[i].experience]!=undefined){
        issues[db[i].experience].behavioral++;
        if(db[i].gotOffer == 'Declined Offer'){
          offerDeclineDueToKnowIssue.behavioral++;
        }
        }
      }
      if(!db[i]['issue'].management && !db[i]['issue'].behavioral){
        if(issues[db[i].experience]!=undefined){
        issues[db[i].experience].other++;
        if(db[i].gotOffer == 'Declined Offer'){
          offerDeclineDueToKnowIssue.other++;
        }
        }
      }

    if(db[i].date.indexOf("2014")>-1){
      db[i]["year"] = "2014"
    }
    else if(db[i].date.indexOf("2015")>-1){
      db[i]["year"] = "2015"
    }
    else if(db[i].date.indexOf("2016")>-1){
      db[i]["year"] = "2016"
    }
    else if(db[i].date.indexOf("2017")>-1){
      db[i]["year"] = "2017"
    }
    else if(db[i].date.indexOf("2018")>-1){
      db[i]["year"] = "2018"
    }
    else if(db[i].date.indexOf("2013")>-1){
      db[i]["year"] = "2013"
    }
  }
  res.status(200).send({
    success: 'true',
    data: db,
    experience:experience,
    issues:issues,
    offerDeclineDueToKnowIssue:offerDeclineDueToKnowIssue
  })
});
const PORT = 5000;
app.use('/', router);
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});
