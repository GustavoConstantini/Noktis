import User from '../models/User';

class SetStatusController {
  async store(req, res) {
    const user = await User.findByPk(req.userId);
    if (!req.body.online) {
      return res.status(400).json({ error: 'Erro ao passar o parametro' });
    }

    req.body.online = req.body.online.toLowerCase();

    const { online } = req.body;

    if (online !== 'false' && online !== 'true' && online !== false && online !== true) {
      return res.status(400).json({ error: 'status invalido' });
    }

    if (online === 'false' || online === false) {
      setTimeout(async () => {
        await user.update(req.body);

        return res.status(200).json({ ok: 'status atualizado' });
      }, 120000);
    }

    if (online === 'true' || online === true) {
      await user.update(req.body);

      return res.status(200).json({ ok: 'status atualizado' });
    }
  }
}

export default new SetStatusController();
