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

      const user = await User.findOne({ where: { id: req.userId }, include: ['profiles', 'choices', 'locations'] });

      const { password } = req.body;

      if (!(await user.checkPassword(password))) {
        return res.status(400).json({ error: 'senha informada é inválida' });
      }

      if (user.profiles.filename === 'default_avatar_female.jpg' || user.profiles.filename === 'default_avatar_male.jpg') {
        await user.destroy();

        return res.status(200).json({ ok: true });
      }

      unlinkDelete(`uploads/${user.profiles.filename}`);

      await user.choices.destroy();
      await user.locations.destroy();
      await user.profiles.destroy();
      await user.destroy();

      return res.status(200).json({ ok: true });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao delete a conta' });
    }
  }
}

export default new DeleteAccountController();
