import { Request, Response } from 'express';
import { getUserByToken } from '../helpers/getUserByToken';
import { UserModel } from '../models/user.model';
import bcrypt from 'bcryptjs';

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