import { promisify } from 'util';
import { unlink } from 'fs';
import * as Yup from 'yup';
import User from '../models/User';

class DeleteAccountController {
  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        password: Yup.string()
          .required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Falha ao validar' });
      }

      const unlinkDelete = promisify(unlink);

      const user = await User.findByPk(req.userId);

      const { password } = req.body;

      if (!(await user.checkPassword(password))) {
        return res.status(400).json({ error: 'senha informada é inválida' });
      }

      if (user.filename === 'default_avatar_female.jpg' || user.filename === 'default_avatar_male.jpg') {
        await user.destroy();

        return res.status(200).json({ ok: true });
      }

      unlinkDelete(`uploads/${user.filename}`);

      await user.destroy();

      return res.status(200).json({ ok: true });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao delete a conta' });
    }
  }
}

export default new DeleteAccountController();
