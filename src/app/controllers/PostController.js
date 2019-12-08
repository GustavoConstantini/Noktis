import sequelize from 'sequelize';
import User from '../models/User';

class PostController {
  async store(req, res) {
    try {
      const user = await User.findOne({ where: { id: req.userId }, include: ['posts'] });

      const post = {
        date: Date.now(),
      };

      if (req.file && req.body.description) {
        const { filename: image } = req.file;

        const { description } = req.body;

        post.image = image;

        post.description = description;
      } else if (req.file && !req.body.description) {
        const { filename: image } = req.file;

        post.image = image;
      } else if (!req.file && req.body.description) {
        const { description } = req.body;

        post.description = description;
      } else {
        return res.status(400).json({ error: 'Erro ao processar o post' });
      }

      await user.posts.update(
        { post: sequelize.fn('array_append', sequelize.col('post'), JSON.stringify(post)) },
        { where: { user_id: user.id } },
      );

      return res.status(200).json({ post });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao processar o post' });
    }
  }
}

export default new PostController();
