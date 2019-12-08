import User from '../models/User';
import Post from '../models/Post';
import Profile from '../models/Profile';

class GetPostsController {
  async index(req, res) {
    try {
      const data = await User.findOne({
        where: { id: req.body.id },
        attributes: { exclude: ['createdAt', 'updatedAt', 'id', 'email', 'password_hash'] },
        include: [{
          model: Post,
          as: 'posts',
          attributes: { exclude: ['createdAt', 'updatedAt', 'id', 'UserId', 'user_id'] },
          where: { user_id: req.body.id },
        },
        {
          model: Profile,
          as: 'profiles',
          attributes: { exclude: ['createdAt', 'updatedAt', 'id', 'UserId', 'user_id'] },
          where: { user_id: req.body.id },
        }],
      });

      const { post } = data.posts;
      const { profiles: profile } = data;


      return res.status(200).json({ post, profile });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao buscar os Posts' });
    }
  }
}

export default new GetPostsController();
