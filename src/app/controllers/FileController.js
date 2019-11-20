import User from '../models/User';

class FileController {
  async store(req, res) {
    const user = await User.findByPk(req.userId);

    const { filename } = req.file;

    await user.update(req.file);

    return res.status(200).json({ filename });
  }
}
export default new FileController();
