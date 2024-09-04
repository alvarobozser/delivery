const db= require('../config/config');
const bcrypt = require('bcryptjs');

const User ={};

User.findById = (id, result) =>{
    const sql = `
    SELECT
        U.id,
        U.email,
        U.name,
        U.lastname,
        U.image,
        U.phone,
        U.password,
        json_arrayagg(
            json_object(
                'id', CONVERT(R.id, char),
                'name', R.name,
                'image', R.image,
                'route', R.route
            )
        ) AS roles
    FROM
        users AS U
    INNER JOIN
        user_has_roles AS UHR ON UHR.id_user = U.id
    INNER JOIN
        roles AS R ON UHR.id_rol = R.id
    WHERE
        U.id = ?
    GROUP BY 
        U.id;
    `;

    db.query(sql,
        [id],
        (error,res)=>{
            if(error) {
                console.log('Error', error);
                result(error,null);
            }else{
                console.log('Encontrado Usuario con ID:', res[0]);
                result(null,res[0]);
            }
            
        } 
    )
}

User.findByEmail = (email, result) =>{
    const sql = `
    SELECT
    U.id,
    U.email,
    U.name,
    U.lastname,
    U.image,
    U.phone,
    U.password,
    json_arrayagg(
        json_object(
        'id',CONVERT(R.id,char),
        'name',R.name,
        'image',R.image,
        'route',R.route
        )
    ) AS roles
    FROM
        users AS U
    INNER JOIN
        user_has_roles AS UHR
    ON
        UHR.id_user = U.id
    INNER JOIN
        roles AS R
    ON
        UHR.id_rol = R.id
    WHERE
        email=?
    GROUP BY 
    U.id;
    `;

    db.query(sql,
        [email],
        (error,res)=>{
            if(error) {
                console.log('Error', error);
                result(error,null);
            }else{
                console.log('Encontrado Usuario con ID:', res[0]);
                result(null,res[0]);
            }
            
        } 
    )
}

User.create = async (user,result) =>{

    const hash = await bcrypt.hash(user.password,10);

    const sql = `
    INSERT INTO users(
    email,
    name,
    lastname,
    phone,
    image,
    password,
    created_at,
    updated_at
    )
    VALUES (?,?,?,?,?,?,?,?)`
    ;

    db.query(
        sql,
        [
            user.email,
            user.name,
            user.lastname,
            user.phone,
            user.image,
            hash,
            new Date(),
            new Date(),
        ],
        (error,res)=>{
            if(error) {
                console.log('Error', error);
                result(error,null);
            }else{
                console.log('UserId', res.insertId);
                result(null,res.insertId);
            }
            
        }    
    );
}

User.update = async (user, result) => {

    let hash;
    let updatePassword = false;

    // Verifica si `user.password` es una cadena y no está encriptada
    if (user.password && typeof user.password === 'string' && !user.password.startsWith('$2a$')) {
        hash = await bcrypt.hash(user.password, 10);
        updatePassword = true; // Se va a actualizar el password
    } else if (user.password && typeof user.password === 'string') {
        hash = user.password; // La contraseña ya está encriptada
        updatePassword = true; // Se va a actualizar el password
    }

    let sql = `
    UPDATE
        users
    SET
        name = ?,
        lastname = ?,
        phone = ?,
        image = ?,
        email = ?,
        updated_at = ?
    `;

    const values = [
        user.name,
        user.lastname,
        user.phone,
        user.image,
        user.email,
        new Date(),
        user.id
    ];

    if (updatePassword) {
        sql += `, password = ?`;
        values.splice(6, 0, hash); // Inserta el hash en la posición correcta, justo antes de `updated_at`
    }

    sql += ` WHERE id = ?`;

    db.query(
        sql,
        values,
        (error, res) => {
            if (error) {
                console.log('Error', error);
                result(error, null);
            } else {
                console.log('Usuario actualizado', res.insertId);
                result(null, user.id);
            }
        }
    );
}


User.updateWithoutImage=async (user,result)=>{

    let hash;
    let updatePassword = false;

    // Verifica si `user.password` es una cadena y no está encriptada
    if (user.password && typeof user.password === 'string' && !user.password.startsWith('$2a$')) {
        hash = await bcrypt.hash(user.password, 10);
        updatePassword = true; // Se va a actualizar el password
    } else if (user.password && typeof user.password === 'string') {
        hash = user.password; // La contraseña ya está encriptada
        updatePassword = true; // Se va a actualizar el password
    }

    let sql = `
    UPDATE
        users
    SET
        name = ?,
        lastname = ?,
        phone = ?,
        email= ?,
        updated_at=?
    `;

    const values = [
        user.name,
        user.lastname,
        user.phone,
        user.email,
        new Date(),
        user.id
    ];

    if (updatePassword) {
        sql += `, password = ?`;
        values.splice(5, 0, hash); // Inserta el hash en la posición correcta, justo antes de `updated_at`
    }

    sql += ` WHERE id = ?`;

    db.query(
        sql,values,
        (error,res)=>{
            if(error) {
                console.log('Error', error);
                result(error,null);
            }else{
                console.log('Actualizado Usuario', res.insertId);
                result(null,user.id);
            }
            
        }    
    );
}

module.exports = User;