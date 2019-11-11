import User from '../models/User';

class FileController {
  async store(req, res) {
    const user = await User.findByPk(req.userId);


    const {
      id, name, sexo, bio, path, email, admin,
    } = await user.update(req.file);

    return res.json({
      id, name, sexo, bio, path, email, admin,
    });
  }
}

export default new FileController();
