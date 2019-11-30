import User from '../models/User';

export default async (socket) => {
  const user = await User.findByPk(socket.userId);
  user.online = false;

  user.socket = null;

  await user.save();
};
