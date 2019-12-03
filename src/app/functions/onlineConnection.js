import sequelize from 'sequelize';
import User from '../models/User';
import addDistancia from './addDistancia';

export default async function io(Socket) {
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

    Socket.on('sendMessage', async (json) => {
      const data = JSON.parse(json);

      const matchUser = await User.findByPk(data.id);

      const { dataValues: Filter } = await User.findOne({ where: { id: Socket.userId }, attributes: { exclude: ['password_hash', 'email', 'createdAt', 'updatedAt', 'matches', 'likes', 'dislikes', 'socket', 'age_range'] } });

      const userFilter = addDistancia(Filter, matchUser.latitude, matchUser.longitude);

      const hours = new Date().getHours();

      const minutes = new Date().getMinutes();

      const date = `${hours}:${minutes}`;

      const message = {
        sender: userFilter,
        messege: data.message,
        hours: date,
      };

      if (matchUser.socket) {
        this.io.to(matchUser.socket).emit('receiveMessage', message);
      } else {
        await matchUser.update(
          { await_message: sequelize.fn('array_append', sequelize.col('await_message'), JSON.stringify(message)) },
          { where: { id: matchUser.id } },
        );
      }
    });
  } catch (error) {
    return new Error(error);
  }
  return this;
}
