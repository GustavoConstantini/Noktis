import Profile from '../models/Profile';

class FileController {
  async store(req, res) {
    try {
      const profile = await Profile.findOne({ where: { user_id: req.userId } });

      const { filename } = req.file;

      await profile.update({ filename });

      return res.status(200).json({ filename });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao processar o arquivo' });
    }
  }
}
export default new FileController();
