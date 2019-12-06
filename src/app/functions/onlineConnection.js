import sequelize from 'sequelize';
import User from '../models/User';

export default async function io(Socket) {
  try {
    const user = await User.findOne({ where: { id: Socket.userId }, include: ['profiles', 'connections'] });

    await user.connections.update({ socket: Socket.id });

    if (user.connections.socket && user.connections.await_message) {
      user.connections.await_message.map((index) => {
        this.io.to(user.connections.socket).emit('receiveMessage', index);
        return this;
      });
      await user.connections.update({ await_message: [] });
    }

    if (user.connections.socket && user.connections.await_matches) {
      user.connections.await_matches.map((index) => {
        this.io.to(user.connections.socket).emit('match', index);
        return this;
      });
      await user.connections.update({ await_matches: [] });
    }

    Socket.on('disconnect', async () => {
      await user.connections.update({ socket: null });
    });

    Socket.on('sendMessage', async (json) => {
      const data = JSON.parse(json);

      const matchUser = await User.findOne({ where: { id: data.id }, include: ['connections'] });

      const date = Date.now();

      const message = {
        sender: user.profiles,
        message: data.message,
        timestamp: date,
      };

      if (matchUser.connections.socket) {
        this.io.to(matchUser.connections.socket).emit('receiveMessage', message);
      } else {
        await matchUser.connections.update(
          { await_message: sequelize.fn('array_append', sequelize.col('await_message'), JSON.stringify(message)) },
          { where: { user_id: matchUser.id } },
        );
      }
    });
  } catch (error) {
    return new Error(error);
  }
  return this;
}
