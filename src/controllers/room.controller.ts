import { Request, Response } from "express";
import { getUserByToken } from "../helpers/getUserByToken";
import { RoomModel } from "../models/room.model";

export const createRoom = async (req: Request, res: Response) => {
  const user = await getUserByToken(req);
  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado!" });
  }

  const { name, isPrivate } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ message: "Nome da sala é obrigatório." });
  }

  try {
    const newRoom = new RoomModel({
      name: name,
      owner: user._id,
      isPrivate: isPrivate,
      participants: [user._id],
    });

    await newRoom.save();

    return res
      .status(201)
      .json({ message: "Sala criada com sucesso!", room: newRoom });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao criar sala." });
  }
};

export const getRooms = async (req: Request, res: Response) => {
  const user = await getUserByToken(req);
  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado!" });
  }

  try {
    const rooms = await RoomModel.find({ participants: user._id })
    return res.status(200).json(rooms);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar salas." });
  }
};

export const getRoom = async (req: Request, res: Response) => {
  const user = await getUserByToken(req);
  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado!" });
  }

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "ID da sala é obrigatório." });
  }

  try {
    const room = await RoomModel.findById(id)
      .populate("owner", "username")
      .populate("participants", "username");
    if (!room) {
      return res.status(404).json({ message: "Sala não encontrada." });
    }

    return res.status(200).json(room);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar sala." });
  }
};

//TODO: only edits room name and privacy, still need to implement adding/removing participants.
export const editRoom = async (req: Request, res: Response) => {
  const user = await getUserByToken(req);
  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado!" });
  }

  const { id } = req.params;
  const { name, isPrivate } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID da sala é obrigatório." });
  }

  try {
    const room = await RoomModel.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Sala não encontrada." });
    }

    if (room.owner.toString() !== user.id) {
      return res
        .status(403)
        .json({ message: "Você não tem permissão para editar esta sala." });
    }

    if (name && typeof name === "string" && name.trim() !== "") {
      room.name = name;
    }
    if (typeof isPrivate === "boolean") {
      room.isPrivate = isPrivate;
    }

    await room.save();
    return res.status(200).json({ message: "Sala editada com sucesso!", room });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao editar sala." });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  const user = await getUserByToken(req);
  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado!" });
  }

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "ID da sala é obrigatório." });
  }

  try {
    const room = await RoomModel.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Sala não encontrada." });
    }

    if (user.role === "user" && room.owner.toString() !== user.id) {
      return res
        .status(403)
        .json({ message: "Você não tem permissão para deletar esta sala." });
    }

    await room.deleteOne();
    return res.status(200).json({ message: "Sala deletada com sucesso!" });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao deletar sala." });
  }
};

export const joinRoom = async (req: Request, res: Response) => {
  const user = await getUserByToken(req);
  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado!" });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID da sala é obrigatório." });
  }

  try {
    const room = await RoomModel.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Sala não encontrada." });
    }

    if (room.participants.includes(user._id)) {
      return res.status(400).json({ message: "Você já está nesta sala." });
    }

    room.participants.push(user._id);
    await room.save();

    return res
      .status(200)
      .json({ message: "Você entrou na sala com sucesso!", room });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao entrar na sala." });
  }
};

export const leaveRoom = async (req: Request, res: Response) => {
  const user = await getUserByToken(req);
  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado!" });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID da sala é obrigatório." });
  }

  try {
    const room = await RoomModel.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Sala não encontrada." });
    }

    if (!room.participants.includes(user._id)) {
      return res.status(400).json({ message: "Você não está nesta sala." });
    }

    room.participants = room.participants.filter(
      (participant) => participant.toString() !== user.id
    );
    await room.save();

    return res.status(200).json({ message: "Você saiu da sala:", room });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao sair da sala." });
  }
};

//Removes a participant from a room. Only the room owner can do this.
export const removeParticipant = async (req: Request, res: Response) => {
  const user = await getUserByToken(req);

  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado!" });
  }

  const { roomId, userId } = req.body;

  if (!roomId || !userId) {
    return res
      .status(400)
      .json({ message: "Sala e participante são obrigatórios." });
  }

  try {
    const room = await RoomModel.findById(roomId);
    
    if (user.id != room!.owner.id) {
      return res
        .status(403)
        .json({ message: "Apenas o dono da sala pode remover participantes." });
    }
    
    if (room!.owner.id === userId) {
      return res
        .status(400)
        .json({ message: "Dono da sala não pode ser removido." });
    }

    room!.participants = room!.participants.filter(
      (participant) => participant.id !== userId
    );
    await room!.save();
    return res
      .status(200)
      .json({ message: "Participante removido com sucesso.", id: userId });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao remover participante." });
  }
};
