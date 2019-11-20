import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .max(40),
      sex: Yup.string()
        .required()
        .max(1),
      bio: Yup.string()
        .required()
        .max(150),
      latitude: Yup.string(),
      longitude: Yup.string(),
      email: Yup.string()
        .email()
        .required()
        .max(70),
      password: Yup.string()
        .required()
        .min(5),
    });

    const { sex } = req.body;


    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha ao validar' });
    }

    if (sex.toUpperCase() !== 'F' && sex.toUpperCase() !== 'M') {
      return res.status(400).json({ error: 'Falha ao validar' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'Este usuário já existe' });
    }

    req.body.sex = sex.toUpperCase();

    if (req.body.sex === 'F') {
      req.body.filename = 'default_avatar_female.jpg';
    } else {
      req.body.filename = 'default_avatar_male.jpg';
    }

    const {
      id, name, bio, email, filename, latitude, longitude,
    } = await User.create(req.body);

    return res.json({
      user: {
        id,
        name,
        sex: req.body.sex,
        bio,
        filename,
        latitude,
        longitude,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email(),
      name: Yup.string()
        .max(40),
      sex: Yup.string()
        .max(1),
      bio: Yup.string()
        .max(150),
      oldPassword: Yup.string(),
      password: Yup.string()
        .min(5)
        .max(64)
        .when('oldPassword', (oldPassword, field) => (oldPassword ? field.required() : field)),
      confirmPassword: Yup.string().when('password', (password, field) => (password ? field.required().oneOf([Yup.ref('password')]) : field)),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha ao validar ' });
    }

    const { sex } = req.body;


    if (sex) {
      req.body.sex = req.body.sex.toUpperCase();
      if (sex !== 'F' && sex !== 'M') {
        return res.status(400).json({ error: 'Falha ao validar ' });
      }
    }
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email) {
      if (email !== user.email) {
        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
          return res.status(400).json({ error: 'Este usuário já existe ' });
        }
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(400).json({ error: 'As senhas não coincidem' });
    }

    const {
      id, name, bio,
    } = await user.update(req.body);

    return res.status(200).json({
      id, name, sex, bio, email,
    });
  }
}

export default new UserController();
