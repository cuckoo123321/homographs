const eventModel = require('../models/eventModel');


const eventController = {

    getAll: (req, res)=>{
        eventModel.getAll((err, results)=>{
            if(err){
                console.log(err);
            }
            res.render('event/eventList',{
                event: results,
            });
        })
    },

    
    //前端用 API    
    getEventData: async (req, res) => {
        try {
            const eventData = await eventModel.getEventData();
            res.json(eventData);
        } catch (error) {
            console.error('Error fetching event data:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = eventController;