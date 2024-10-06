const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserController {
  async createUser(req, res) {
    const {
      name,
      surname,
      middlename,
      phone,
      email,
      address,
      gender,
      age,
      birth_date,
      is_sportsman,
      sport_type,
      description,
      password,
    } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await db.query(
        `INSERT INTO users (name, surname, middlename, phone, email, address, gender, age, birth_date, is_sportsman, sport_type, description, password) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
         RETURNING *`,
        [
          name,
          surname,
          middlename,
          phone,
          email,
          address,
          gender,
          age,
          birth_date,
          is_sportsman,
          sport_type,
          description,
          hashedPassword,
        ]
      );
      res.json(newUser.rows[0]);
    } catch (err) {
      console.error('Error creating user:', err.message);
      res.status(500).json({ error: err.message });
    }
  }

  async loginUser(req, res) {
    const { email, password } = req.body;
    try {
      const userResult = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      const user = userResult.rows[0];

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      const token = jwt.sign(
        { userId: user.user_id, email: user.email },
        'your_secret_key',
        { expiresIn: '24h' }
      );

      res.json({ message: 'Login successful', token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getUsers(req, res) {
    const users = await db.query(`SELECT * FROM users`);
    res.json(users.rows);
  }

  async getOneUser(req, res) {
    const user_id = req.params.id;
    const user = await db.query(`SELECT * FROM users WHERE user_id = $1`, [
      user_id,
    ]);
    res.json(user.rows[0]);
  }

  async updateUser(req, res) {
    const {
      user_id,
      name,
      surname,
      middlename,
      phone,
      email,
      address,
      gender,
      age,
      birth_date,
      is_sportsman,
      sport_type,
      description,
      password,
    } = req.body;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const user = await db.query(
      `UPDATE users 
             SET name = $1, surname = $2, middlename = $3, phone = $4, email = $5, address = $6, gender = $7, age = $8, birth_date = $9, is_sportsman = $10, sport_type = $11, description = $12, password = COALESCE($13, password) 
             WHERE user_id = $14 
             RETURNING *`,
      [
        name,
        surname,
        middlename,
        phone,
        email,
        address,
        gender,
        age,
        birth_date,
        is_sportsman,
        sport_type,
        description,
        hashedPassword,
        user_id,
      ]
    );
    res.json(user.rows[0]);
  }

  async deleteUser(req, res) {
    const user_id = req.params.id;
    const user = await db.query(
      `DELETE FROM users WHERE user_id = $1 RETURNING *`,
      [user_id]
    );
    res.json(user.rows[0]);
  }
}

module.exports = new UserController();
