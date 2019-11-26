import { promisify } from 'util';
import { unlink } from 'fs';
import * as Yup from 'yup';
import User from '../models/User';

class DeleteAccountController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .required(),
      password: Yup.string()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha ao validar' });
    }

    const unlinkDelete = promisify(unlink);

    const user = await User.findByPk(req.userId);

    const { email, password } = req.body;

    if (!(await user.checkPassword(password))) {
      return res.status(400).json({ error: 'senha informada é inválida' });
    }

    if (email !== user.email) {
      return res.status(400).json({ error: 'Email informado é inválido ' });
    }

    if (user.filename === 'default_avatar_female.jpg' || user.filename === 'default_avatar_male.jpg') {
      await user.destroy();

      return res.status(200).json({ ok: true });
    }

    unlinkDelete(`uploads/${user.filename}`);

    await user.destroy();

    return res.status(200).json({ ok: true });
  }
}

export default new DeleteAccountController();
