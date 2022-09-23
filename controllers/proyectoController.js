
import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";
import Usuario from "../models/Usuarios.js";

const obtenerProyectos = async (req, res) => {
    const proyectos = await Proyecto.find({
        $or:[
            {colaboradores:{$in:req.usuario}},
            {creador:{$in:req.usuario}},
        ]
    })
    .select('-tareas');
    res.json(proyectos);
};

const nuevoProyecto = async (req, res) => {

    const proyecto = new Proyecto(req.body)
    proyecto.creador = req.usuario._id

    try {
        const proyectoAlmacenado = await proyecto.save()
        res.json(proyectoAlmacenado);
    } catch (error) {
        console.log(error)
    }
};

const obtenerProyecto = async (req, res) => {
    const { id } = req.params;

    const proyecto = await Proyecto.findById(id).populate({path:'tareas', populate: {path:'completado',select:"primernombre primerapellido celular"}})
    .populate('colaboradores',"email primernombre primerapellido ");
    //console.log(proyecto)

    if (!proyecto) {
        const error = new Error("Proyecto no encontrado");
        return res.status(404).json({ msg: error.message });
    }

    if (proyecto.creador.toString() !== req.usuario._id.toString() && !proyecto.
    colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString() ) ) {
        const error = new Error("Accion no valida");
        return res.status(404).json({ msg: error.message });
    }

    //obtener las tareas del proyecto
    const tareas = await Tarea.find().where('proyecto').equals(proyecto._id);

    res.json(proyecto);
};

const editarProyecto = async (req, res) => {
    const { id } = req.params;

    const proyecto = await Proyecto.findById(id);
    //console.log(proyecto)

    if (!proyecto) {
        const error = new Error("Proyecto no encontrado");
        return res.status(404).json({ msg: error.message });
    }

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no valida");
        return res.status(404).json({ msg: error.message });
    }

    proyecto.nombre = req.body.nombre || proyecto.nombre;
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
    proyecto.cliente = req.body.cliente || proyecto.cliente;
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;

    try {
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado)
    } catch (error) {
        console.log(error)
    }
};

const eliminarProyecto = async (req, res) => {
    const { id } = req.params;

    const proyecto = await Proyecto.findById(id);
    //console.log(proyecto)

    if (!proyecto) {
        const error = new Error("Proyecto no encontrado");
        return res.status(404).json({ msg: error.message });
    }

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no valida");
        return res.status(404).json({ msg: error.message });
    }

    try {
        await proyecto.deleteOne();
        res.json({ msg: "Proyecto Eliminado" })
    } catch (error) {
        console.log(error);
    }

};

const buscarColaborador = async (req, res) => {
    const { email } = req.body
    const usuario = await Usuario.findOne({ email })

    if (!usuario) {
        const error = new Error("Usuario no encontrado");
        return res.status(404).json({ msg: error.message });
    }
    //console.log(usuario)
    res.json(usuario);

};

const agregarColaborador = async (req, res) => {

    const proyecto = await Proyecto.findById(req.params.id);
    
    if (!proyecto) {
        const error = new Error("Proyecto no encontrado");
        return res.status(404).json({ msg: error.message });
    }

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no");
        return res.status(404).json({ msg: error.message });
    };
 
    const { email } = req.body
    const usuario = await Usuario.findOne({ email })
  
    if (!usuario) {
        const error = new Error("Usuario no encontrado");
        return res.status(404).json({ msg: error.message });
    }
    
    if (proyecto.creador.toString() === usuario._id.toString()) {
        const error = new Error("El creador del proyecto no puede ser colaborador");
        return res.status(404).json({ msg: error.message });
    } 

    if(proyecto.colaboradores.includes(usuario._id)){
        const error = new Error("El colaborador ya se encuentra agregado");
        return res.status(404).json({ msg: error.message });
    }

    proyecto.colaboradores.push(usuario._id);
    await proyecto.save()
    res.json({msg:'Colaborador Agregado'})
    //console.log(error.response);
};

const eliminarColaborador = async (req, res) => {

    const proyecto = await Proyecto.findById(req.params.id);
    
    if (!proyecto) {
        const error = new Error("Proyecto no encontrado");
        return res.status(404).json({ msg: error.message });
    }

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no valida");
        return res.status(404).json({ msg: error.message });
    };
 
    proyecto.colaboradores.pull(req.body.id);
    await proyecto.save()
    res.json({msg:'Colaborador eliminado correctamente'})
    //console.log(error.response);

};

const obtenerTareas = async (req, res) => {
    const { id } = req.params;

    const existeProyecto = await Proyecto.findById(id);


    if (!existeProyecto) {
        const error = new Error("Proyecto no encontrado");
        return res.status(404).json({ msg: error.message });
    }

    const tareas = await Tarea.find().where('proyecto').equals(id);
    res.json(tareas);
};

export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador,
    obtenerTareas,
}