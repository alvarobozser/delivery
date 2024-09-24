const userControllers = require('../controllers/usersControllers');
const passport = require('passport');

module.exports = (app,upload)=>{
    
    app.get('/api/users/findDeliveryMen', passport.authenticate('jwt', { session: false }),userControllers.findDeliveryMen);

    app.post('/api/users/create',userControllers.register);
    app.post('/api/users/createWithImage',upload.array('image',1),userControllers.registerWithImage);
    app.post('/api/users/login',userControllers.login);

    //Auth JWT
    app.put('/api/users/update',passport.authenticate('jwt',{session:false}),upload.array('image',1),userControllers.updateWithImage);
    app.put('/api/users/updateWithOutImage',passport.authenticate('jwt',{session:false}),userControllers.updateWithOutImage);

}