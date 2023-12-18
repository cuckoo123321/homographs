const EventModel = require('../models/2eventModel');

const EventController = {
    getAll: (req, res)=>{
        EventModel.getAll((err, results)=>{
            if(err){
                console.log(err);
            }
            res.render('Event2/EventList',{
                event: results,
            });
        })
    },
}

module.exports = EventController;
