import * as express from 'express';
import * as userController from '../controllers/user';
import * as authMiddleware from '../middleware/auth';

const router = express.Router();

//login
router.post('/login', userController.login);
//register
router.post('/register', userController.registerAdmin);



//add staff
router.post('/add-staff', authMiddleware.auth, authMiddleware.isAdmin, userController.addStaff);

//remove staff
router.delete('/remove-staff/:id', authMiddleware.auth, authMiddleware.isAdmin, userController.removeStaff);

export default router;





