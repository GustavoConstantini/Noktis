import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import sequelize from 'sequelize';

import User from '../models/User';
import Profile from '../models/Profile';
import Location from '../models/Location';
import Choice from '../models/Choice';
import Connection from '../models/Connection';

import authConfig from '../../config/auth';
import checkAge from '../functions/ckeckAge';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .max(40),
      birth_timestamp: Yup.number()
        .required(),
      sex: Yup.string()
        .required()
        .max(1),
      bio: Yup.string()
        .required()
        .max(150),
      latitude: Yup.string(),
      longitude: Yup.string(),
      phone: Yup.string(),
      // .required(),
      email: Yup.string()
        .email()
        .required()
        .max(70),
      password: Yup.string()
        .required()
        .min(5),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha ao validar' });
    }

    if (!(checkAge(req.body.birth_timestamp))) {
      return res.status(400).json({ error: 'Menor de idade' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'Este usuário já existe' });
    }

    req.body.name = req.body.name.trim();
    req.body.bio = req.body.bio.trim();
    req.body.sex = req.body.sex.toUpperCase();

    if (req.body.sex !== 'F' && req.body.sex !== 'M') {
      return res.status(400).json({ error: 'Falha ao validar' });
    }

    if (req.body.sex === 'F') {
      req.body.filename = 'default_avatar_female.jpg';
    } else {
      req.body.filename = 'default_avatar_male.jpg';
    }

    const {
      id, email,
    } = await User.create(req.body);

    const {
      name,
      birth_timestamp,
      sex,
      bio,
      latitude,
      longitude,
    } = req.body;

    await Location.create({ user_id: id, latitude, longitude });
    await Choice.create({ user_id: id });
    await Connection.create({ user_id: id });

    const { age } = await Profile.create({
      user_id: id,
      filename: req.body.filename,
      name,
      birth_timestamp,
      sex,
      bio,
    });

    const user = await User.findOne({ where: { id }, include: ['connections'] });

    const { phone } = req.body;

    const date = Date.now();

    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    let ip = req.header('x-forwarded-for') || req.connection.remoteAddress;

    if (ip.substr(0, 7) === '::ffff:') {
      ip = ip.substr(7);
    }

    const sessions = {
      ip,
      authorization: token,
      timestamp: date,
      phone,
    };

    await user.connections.update(
      { sessions: sequelize.fn('array_append', sequelize.col('sessions'), JSON.stringify(sessions)) },
      { where: { user_id: id } },
    );

    return res.json({
      user: {
        name,
        age,
        sex,
        bio,
        id,
        filename: req.body.filename,
        latitude,
        longitude,
        email,
      },
      token,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email(),
      bio: Yup.string()
        .max(150),
      age_range: Yup.string()
        .max(6),
      max_distance: Yup.string()
        .max(6),
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

    const { email, oldPassword } = req.body;

    const user = await User.findOne({ where: { id: req.userId }, include: ['profiles', 'choices'] });

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

    const { name, bio, filename } = await user.profiles.update(req.body);

    const { age_range, max_distance } = await user.choices.update(req.body);

    await user.update(req.body);

    return res.status(200).json({
      name, bio, filename, email, age_range, max_distance,
    });
  }
}

export default new UserController();
