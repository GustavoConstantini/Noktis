import User from '../models/User';

class BlockMatchesController {
  async store(req, res) {
    try {
      const user = await User.findOne({ where: { id: req.userId }, include: ['choices'] });

      const blockedUser = await User.findOne({ where: { id: req.body.block }, include: ['choices'] });

      const whereBlockUser = user.choices.matches.indexOf(req.body.block);

      user.choices.matches.splice(whereBlockUser, 1);

      await user.choices.update({ matches: user.choices.matches });

      if (blockedUser.choices.matches.includes(user.id)) {
        const whereUser = blockedUser.choices.matches.indexOf(user.id);

        blockedUser.choices.matches.splice(whereUser, 1);

        await blockedUser.choices.update({ matches: blockedUser.choices.matches });
      }

      return res.status(200).json({ ok: 'Usuário bloqueado' });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao bloquear o usuário' });
    }
  }
}
export default new BlockMatchesController();
