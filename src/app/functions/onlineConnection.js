import User from '../models/User';

export default async (socket) => {
  const user = await User.findByPk(socket.userId);
  user.online = true;

  user.socket = socket.id;

  await user.save();
};
