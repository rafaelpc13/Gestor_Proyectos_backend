import Usuario from "../models/Usuarios.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import {emailRegistro,emailOlvidePassword} from '../helpers/email.js';

const registrar = async (req, res) => {
    //evitar registros duplicados
    const { email } = req.body;
    const existeusuario = await Usuario.findOne({ email });
    if (existeusuario) {
        const error = new Error("Usuario ya registrado");
        return res.status(400).json({ msg: error.message });
    }
    try {
        const usuario = new Usuario(req.body)
        usuario.token=generarId();
        const usuarioAlmacenado = await usuario.save();
// enviar el email

emailRegistro({
    email:usuario.email,
    nombre: usuario.primernombre,
    apellido:usuario.primerapellido,
    token:usuario.token
})
        res.json({
            msg:"Ususario creado, Revisa tu email para confirmar tu cuenta"});
    } catch (error) {
        console.log(error);
    }

};

const autenticar = async(req,res)=>{

    const {email,password}= req.body;

    //Comprobar si el usuario Existe

const usuario = await Usuario.findOne({email})
if(!usuario){
    const error = new Error ("El usuario no Existe");
    return res.status(404).json({msg:error.message});
}
//Comprobar si el usuario esta Confirmado

if(!usuario.confirmado){
    const error = new Error ("Tu cuenta no ha sido confirmada");
    return res.status(403).json({msg:error.message});
}

//Comprobar password
if(await usuario.comprobarPassword(password)){
    res.json({
        _id:usuario._id,
        nombre:usuario.primernombre,
        email: usuario.email,
        token:generarJWT(usuario._id),
    });
}else {
    const error = new Error ("El password es incorrecto");
    return res.status(403).json({msg:error.message});
}
};

const confirmar = async (req, res) => {
 
   const {token} = req.params;
   const usuarioConfirmar = await Usuario.findOne({token});

   if(!usuarioConfirmar){
    const error = new Error ("token no valido");
    return res.status(404).json({msg: error.message});
    }

try {
 usuarioConfirmar.confirmado = true;
 usuarioConfirmar.token="";
 await usuarioConfirmar.save();
 res.json({msg:'Usuario Confirmado Correctamente'});
} catch (error) {
    console.log(error);
}

};

const olvidePassword = async (req,res) => {

const { email } = req.body;
const usuario = await Usuario.findOne({ email });
if(!usuario){
    const error = new Error ("El usuario no Existe");
    return res.status(404).json({msg:error.message});
}
try{
usuario.token = generarId();
await usuario.save();

//enviar email
emailOlvidePassword({
    email:usuario.email,
    nombre:usuario.primernombre,
    apellido:usuario.primerapellido,
    token:usuario.token,
  });

res.json({msg:"Hemos enviados un email con las instrucciones"});
}catch (error) {
    console.log(error);
}
};

const comprobarToken = async (req,res) => {

    const {token}=req.params;

    const tokenvalido = await Usuario.findOne({token});

    if(tokenvalido){
      res.json({msg:"Token valido, Usuario existe"})
    }else{
        const error = new Error ("Token np valido");
    return res.status(404).json({msg:error.message});
    }
};

const nuevoPassword = async (req,res) => {
 
    const { token }= req.params;
    const {password}=req.body;
    
    const usuario = await Usuario.findOne({token});

    if(usuario){
    usuario.password=password;
    usuario.token="";
    await usuario.save();
    res.json({msg:"Password Modificado Correctamente"});
    }else{
        const error = new Error ("Token no valido");
    return res.status(404).json({msg:error.message});
    }
};

const perfil = async (req,res) => {
   const { usuario}=req
   res.json(usuario)
};
export { registrar,autenticar,confirmar,olvidePassword,comprobarToken,nuevoPassword,perfil};