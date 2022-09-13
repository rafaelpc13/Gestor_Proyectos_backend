import express from "express";

const router = express.Router();
import { registrar, autenticar,confirmar,olvidePassword,comprobarToken,nuevoPassword,perfil} from "../controllers/usuarioController.js";
import checkAuth from "../middleware/checkAuth.js";

//Creacion, registro  y confrimacion de usuarios

router.post("/", registrar);
router.post("/login", autenticar);
router.get("/confirmar/:token",confirmar);
router.post('/olvide-password', olvidePassword);
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

router.get("/perfil",checkAuth,perfil)

router.get('/', (req, res) => {
    res.json('Desde API/USUARIOS');
});

export default router;