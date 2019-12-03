import sequelize from 'sequelize';
import User from '../models/User';
import addDistancia from './addDistancia';

export default async function io(Socket) {
  try {
    const user = await User.findByPk(Socket.userId);

    user.online = true;

    user.socket = Socket.id;

    await user.save();

    if (user.socket && user.await_message) {
      user.await_message.map((index) => {
        this.io.to(user.socket).emit('awaitMessage', index);
        return this;
      });
      user.await_message = [];
      user.save();
    }

    Socket.on('disconnect', async () => {
      user.online = false;

      user.socket = null;

      await user.save();
    });

    Socket.on('sendMessage', async (json) => {
      const data = JSON.parse(json);

      const matchUser = await User.findByPk(data.id);

      const { dataValues: Filter } = await User.findOne({ where: { id: Socket.userId }, attributes: { exclude: ['password_hash', 'email', 'createdAt', 'updatedAt', 'matches', 'likes', 'dislikes', 'socket', 'age_range', 'await_message'] } });

      const userFilter = addDistancia(Filter, matchUser.latitude, matchUser.longitude);

      const date = Date.now();

      const message = {
        sender: userFilter,
        message: data.message,
        timestamp: date,
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
