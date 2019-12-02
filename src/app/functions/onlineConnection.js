import User from '../models/User';
import jsonEditor from './ jsonEditor';

export default async function io(Socket) {
  try {
    const user = await User.findByPk(Socket.userId);
    const { dataValues: Filter } = await User.findOne({ where: { id: Socket.userId }, attributes: { exclude: ['password_hash', 'email', 'createdAt', 'updatedAt', 'matches', 'likes', 'dislikes', 'socket'] } });
    user.online = true;

    user.socket = Socket.id;

    await user.save();

    Socket.on('disconnect', async () => {
      user.online = false;

      user.socket = null;

      await user.save();
    });

    Socket.on('sendMessage', async (data) => {
      const matchUser = await User.findByPk(data.id);
      const userFilter = jsonEditor(Filter, matchUser.latitude, matchUser.longitude);
      const message = {
        sender: userFilter,
        messege: data.message,
      };
      if (matchUser.online) {
        this.io.to(matchUser.socket).emit('receiveMessage', message);
      }
    });
  } catch (error) {
    return new (Error)();
  }
  return this;
}
