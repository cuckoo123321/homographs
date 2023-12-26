const eventModel = require('../models/eventModel');
//const itemsPerPage = 10;

const eventController = {
    add: (req, res) => {
        res.render('event/eventAdd');
    },
    handleAdd: (req, res, next) => {
        const { event_title, event_date, event_location, event_organizer, event_description, event_website, event_publish } = req.body;

        if(!event_title || !event_date || !event_location || !event_organizer) {
            req.flash('errorMessage', '缺少必要欄位');
            return next();
        }
        eventModel.add({
            event_title, 
            event_date, 
            event_location, 
            event_organizer, 
            event_description, 
            event_website,
            event_publish
        }, (err) => {
            if(err){
                req.flash('errorMessage', err.toString());
                return next();
            }
            res.redirect('/eventList');
        });
    },

    // getAll: (req, res) => {
    //     const page = parseInt(req.query.page) || 1;
    //     const offset = (page - 1) * itemsPerPage;
    //     const limit = itemsPerPage;
    
    //     eventModel.getAll(offset, limit, (err, results) => {
    //         if (err) {
    //             console.log(err);
    //             return res.status(500).send('Internal Server Error');
    //         }
    //         eventModel.getCount((err, count) => {
    //             if (err) {
    //                 console.log(err);
    //                 return res.status(500).send('Internal Server Error');
    //             }
    //             const totalPages = Math.ceil(count / itemsPerPage);
    //             res.render('event/eventList', {
    //                 event: results,
    //                 currentPage: page,
    //                 totalPages: totalPages,
    //             });
    //         });
    //     });
    // },
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


    update:(req, res) => {
        eventModel.getUpdate(req.params.id, (err, results)=>{
            res.render('event/eventUpdate',{
                event: results
            })
        })
    },

    handleUpdate: (req, res)=>{
        const event_updated_at = new Date();
        eventModel.update(
            req.body.event_title, 
            req.body.event_date, 
            req.body.event_location, 
            req.body.event_organizer, 
            req.body.event_description, 
            req.body.event_website, 
            event_updated_at, 
            req.body.event_publish, 
            req.params.id,
            (err)=>{
                if (err) {
                    console.error('Error:', err);
                } else {
                    res.redirect('/eventList');
                }
            }
        )
    },
    delete:(req, res)=>{
        const eventID = req.params.id;
        eventModel.delete(eventID, err => {
            if (err) {
                console.error('Error deleting event:', err);
            } 
            res.redirect('/eventList');
        })
    },

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