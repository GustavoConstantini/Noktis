import User from '../models/User';

export default async (Socket) => {
  try {
    const user = await User.findByPk(Socket.userId);
    user.online = true;

    user.socket = Socket.id;

    await user.save();

    Socket.on('disconnect', async () => {
      user.online = false;

      user.socket = null;

      await user.save();
    });
  } catch (Error) {
    return new (Error)();
  }
  return this;
};
