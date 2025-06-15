import { Request, Response } from 'express';
import { getUserByToken } from '../helpers/getUserByToken';
import { UserModel } from '../models/user.model';
import bcrypt from 'bcryptjs';
import verifyToken from '../helpers/verifyToken';

/**
 * Edit user profile information
 * @route PUT /user/edit
 * @param {Request} req - Express request object containing user update details
 * @param {Response} res - Express response object
 * @returns {Object} Updated user profile or error message
 * @description Updates user profile with new nickname, email, and password after token authentication
 */
export const editUser = async (req: Request, res: Response) => {
    const user = await getUserByToken(req); // get user from token, because "body" is the new user data

    if (!user) {
        res.status(401).json({ message: 'Acesso negado!' });
        return;
    }

    const { nickname, email, password } = req.body;

    // Validate input fields
    if (!nickname || !email || !password) return res.status(400).json({ message: "Todos os campos são obrigatórios." });

    if (password.length < 6) return res.status(400).json({ message: "A senha deve ter no mínimo 6 caracteres." });

    if (user.email !== email) {
        const userExists = await UserModel.findOne({ 
            email,
            _id: { $ne: user._id }
        });
        if (userExists) return res.status(400).json({ message: "Email já em uso." });
    }

    // Update user data
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        user.set({nickname, email, hashedPassword});
        await user.save();
        res.status(200).json({ message: 'Dados atualizados!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar dados!' });
    }
}

/**
 * Retrieve user information in a secure manner
 * @route GET /user/
 * @param {Request} req - Express request object containing authentication token
 * @param {Response} res - Express response object
 * @returns {Object} User profile details including id, nickname, email, and role
 * @description Fetches authenticated user's profile information after token validation
 */
export const getUser = async (req: Request, res: Response) => {
    const user = await getUserByToken(req);
    if (!user) {
        res.status(401).json({ message: 'Acesso negado!' });
        return;
    }

    const objUser = user.toObject();

    res.status(200).json({ 
        user: {
            id: objUser._id, 
            nickname: objUser.nickname, 
            email: objUser.email,
            role: objUser.role
        } 
    });
}

/**
 * Change user's password after verifying current password
 * @route POST /user/change-password
 * @param {Request} req - Express request object containing authentication token and password details
 * @param {Response} res - Express response object
 * @returns {Object} Success or error message after password change attempt
 * @description Allows authenticated user to change their password by providing current and new password
 * Validates password length and uses different salt rounds based on user role
 */
export const changePassword = async (req: Request, res: Response) => {
  const decodedPayload = verifyToken(req)
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await UserModel.findById(decodedPayload?.id).select('+password');
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Senha atual incorreta' });

    // maintains password minnimum length
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'A nova senha deve ter pelo menos 8 caracteres' });
    }

    //if role isn't "user", use 12 as salt rounds
    user.password = await bcrypt.hash(newPassword, user.role === 'user' ? 10 : 12);
    await user.save();

    return res.status(200).json({ message: 'Senha alterada com sucesso' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao trocar senha' });
  }
};