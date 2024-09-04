const Category = require('../models/category');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require ('../config/keys');
const storage = require('../utils/cloud_storage');

module.exports = {

    create(req,res){
        const category = req.body;

        Category.create(category,(error,id)=>{
            if(error){
                return res.status(501).json({
                    success:false,
                    message:'Hubo un error al registrar la categoria',
                    error:error
                });
            }

            return res.status(201).json({
                success:true,
                message:'La categoria se creo correctamente',
                data:`${id}`
            });
        })
    },

    getAll(req, res) {
        Category.getAll((err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar las categorias',
                    error: err
                });
            }

            return res.status(201).json(data);
        });
    }

}