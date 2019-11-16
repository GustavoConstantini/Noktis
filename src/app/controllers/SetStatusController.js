import User from '../models/User';

class SetStatusController {
  async store(req, res) {
    const user = await User.findByPk(req.userId);

    const { online } = req.body;

    if (online.toUpperCase() !== 'FALSE' && online.toUpperCase() !== 'TRUE') {
      return res.status(400).json({ error: 'status invalido' });
    }

    if (online.toUpperCase() === 'FALSE') {
      setTimeout(async () => {
        await user.update(req.body);

        return res.json({ ok: 'status atualizado' });
      }, 30000);
    }

    if (online.toUpperCase() === 'TRUE') {
      await user.update(req.body);

      return res.json({ ok: 'status atualizado' });
    }
  }
}

export default new SetStatusController();
