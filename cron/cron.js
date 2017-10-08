var scheduler = require('node-schedule');

var rule = new scheduler.RecurrenceRule();
rule.hour = 12;
rule.dayOfWeek = new scheduler.Range(0,6);


exports.dailyJob = schedule.scheduleJob(rule, function(){
  console.log('I run on days at 7:00');
});

// scheduler.scheduleJob(rule,task);