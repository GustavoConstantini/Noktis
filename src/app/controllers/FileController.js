import User from '../models/User';

class FileController {
  async store(req, res) {
    try {
      const user = await User.findOne({ where: { id: req.userId }, include: ['profiles'] });

      const { filename } = req.file;

      await user.profiles.update({ filename });

      return res.status(200).json({ filename });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao processar o arquivo' });
    }
  }
}
export default new FileController();
