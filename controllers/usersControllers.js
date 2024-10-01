const User = require('../models/users');
const Rol = require('../models/rol');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require ('../config/keys');
const storage = require('../utils/cloud_storage');

module.exports = {

    findDeliveryMen(req, res) {
        User.findDeliveryMen((err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con al listar los repartidores',
                    error: err
                });
            }

            
            return res.status(201).json(data);
        });
    },

    login(req,res){

        const email=req.body.email;
        const password=req.body.password;

        User.findByEmail(email,async(error,myUser)=>{

            if(error){
                return res.status(501).json({
                    success:false,
                    message:'Hubo un error al encontrar el usuario',
                    error:error
                });
            }

            if(!myUser){
                return res.status(401).json({
                    success:false,
                    message:'El email no fue encontrado',
                    error:error
                });
            }

            const isPasswordValid = await bcrypt.compare(password,myUser.password);

            if(isPasswordValid){
                const token = jwt.sign({id:myUser.id,email:myUser.email},keys.secretOrKey,{});
                const data = {
                    id:`${myUser.id}`,
                    name:myUser.name,
                    lastname:myUser.lastname,
                    email:myUser.email,
                    phone:myUser.phone,
                    image:myUser.image,
                    session_token:`JWT ${token}`,
                    roles:JSON.parse(myUser.roles)
                }

                return res.status(201).json({
                    success:true,
                    message:'El usuario esta autenticado',
                    data:data
                });
            }else{
                return res.status(401).json({
                    success:false,
                    message:'El email o la contraseña es incorrecto',
                    error:error
                });
            }
        });

    },

    register(req,res){
        const user = req.body;
        User.create(user,(error,data)=>{
            if(error){
                return res.status(501).json({
                    success:false,
                    message:'Hubo un error al registrar el usuario',
                    error:error
                });
            }

            return res.status(201).json({
                success:true,
                message:'Se registro el usuario correctamente',
                data:data
            })
        });
    },

    async registerWithImage(req,res){

        const user = JSON.parse(req.body.user);

        const files= req.files;

        if(files.length>0){
            const path = `image_${Date.now()}`;
            const url = await storage(files[0],path)

            if(url != undefined && url!=null){
                user.image = url;
            }
        }

        User.create(user,(error,data)=>{


            if(error){
                return res.status(501).json({
                    success:false,
                    message:'Hubo un error al registrar el usuario',
                    error:error
                });
            }

            user.id = `${data}`;

            const token = jwt.sign({id:user.id,email:user.email},keys.secretOrKey,{});

            user.session_token=`JWT ${token}`;

            Rol.create(user.id,3,(err,data)=>{
                if(err){
                    return res.status(501).json({
                        success:false,
                        message:'Hubo un error al registrar el rol del usuario',
                        error:err
                    });
                } 

                return res.status(201).json({
                    success:true,
                    message:'Se registro el usuario correctamente',
                    data:user
                })
            });      
        });
    },

    async updateWithImage(req,res){
       
        const user = JSON.parse(req.body.user);
        const files= req.files;

        if(files.length>0){
            const path = `image_${Date.now()}`;
            const url = await storage(files[0],path)

            if(url != undefined && url!=null){
                user.image = url;
            }
        }

        User.update(user,(error,data)=>{


            if(error){
                return res.status(501).json({
                    success:false,
                    message:'Hubo un error al actualizar el usuario',
                    error:error
                });
            }

            

            User.findById(data, (err, myData) => {
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con el registro del usuario',
                        error: err
                    });
                }
                
                myData.session_token = user.session_token;
                myData.roles = JSON.parse(myData.roles);
                myData.id = user.id;
                return res.status(201).json({
                    success: true,
                    message: 'El usuario se actualizo correctamente',
                    data: myData
                });
            })     
        });
    },

    async updateWithOutImage(req,res){

        const user = req.body;

        User.updateWithoutImage(user,(error,data)=>{


            if(error){
                return res.status(501).json({
                    success:false,
                    message:'Hubo un error al actualizar el usuario',
                    error:error
                });
            }

            User.findById(data, (err, myData) => {
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con el registro del usuario',
                        error: err
                    });
                }
                
                myData.session_token = user.session_token;
                myData.roles = JSON.parse(myData.roles);
                myData.id = user.id;
                return res.status(201).json({
                    success: true,
                    message: 'El usuario se actualizo correctamente',
                    data: myData
                });
            })    
        });
    },

    async updateNotificationToken(req, res) {

        const id = req.body.id; 
        const token = req.body.token; 

        User.updateNotificationToken(id, token, (err, id_user) => {

        
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error actualizando el token de notificaciones del usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El token se actualizo correctamente',
                data: id_user
            });
            
        });

    },
}