const db= require('../config/config');
const bcrypt = require('bcryptjs');

const Category ={};

Category.getAll = (result) => {
    const sql = `
    SELECT
        CONVERT(id, char) AS id,
        name,
        description
    FROM
        categories
    ORDER BY
        name
    `;

    db.query(
        sql,
        (err, data) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Categorias:', data);
                result(null, data);
            }
        }
    )
}


Category.create=(category,result)=>{
    const sql =`
    INSERT INTO
        categories(
        name,
        description,
        created_at,
        updated_at
        )
    VALUE (?,?,?,?)
    `;

    db.query(
        sql,
        [
            category.name,
            category.description,
            new Date(),
            new Date(),   
        ],
        (error,res)=>{
            if(error) {
                console.log('Error', error);
                result(error,null);
            }else{
                console.log('Id Categoria Creada:', res.insertId);
                result(null,res.insertId);
            }
            
        } 
    )
}

module.exports = Category;