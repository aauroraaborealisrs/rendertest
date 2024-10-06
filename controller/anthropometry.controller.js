const db = require('../db');

class AnthropometryController {
  async createAnthropometry(req, res) {
    const {
      user_id,
      height,
      weight,
      waist_circumference,
      hip_circumference,
      bmi,
      akm,
      dakm,
      zm,
      dzm,
      skm,
      dskm,
      oo,
      oj,
      vz,
      fu,
    } = req.body;

    try {
      const newEntry = await db.query(
        `INSERT INTO anthropometry_bioimpedance 
                (user_id, height, weight, waist_circumference, hip_circumference, bmi, akm, dakm, zm, dzm, skm, dskm, oo, oj, vz, fu) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) 
                RETURNING *`,
        [
          user_id,
          height,
          weight,
          waist_circumference,
          hip_circumference,
          bmi,
          akm,
          dakm,
          zm,
          dzm,
          skm,
          dskm,
          oo,
          oj,
          vz,
          fu,
        ]
      );
      res.json(newEntry.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getAllAnthropometry(req, res) {
    try {
      const entries = await db.query(
        `SELECT * FROM anthropometry_bioimpedance`
      );
      res.json(entries.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getUserAnthropometry(req, res) {
    const user_id = req.params.user_id;
    try {
      const userEntries = await db.query(
        `SELECT * FROM anthropometry_bioimpedance WHERE user_id = $1`,
        [user_id]
      );
      res.json(userEntries.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateAnthropometry(req, res) {
    const {
      id,
      height,
      weight,
      waist_circumference,
      hip_circumference,
      bmi,
      akm,
      dakm,
      zm,
      dzm,
      skm,
      dskm,
      oo,
      oj,
      vz,
      fu,
    } = req.body;

    try {
      const updatedEntry = await db.query(
        `UPDATE anthropometry_bioimpedance 
                SET height = $1, weight = $2, waist_circumference = $3, hip_circumference = $4, 
                    bmi = $5, akm = $6, dakm = $7, zm = $8, dzm = $9, skm = $10, dskm = $11, oo = $12, oj = $13, vz = $14, fu = $15
                WHERE id = $16 
                RETURNING *`,
        [
          height,
          weight,
          waist_circumference,
          hip_circumference,
          bmi,
          akm,
          dakm,
          zm,
          dzm,
          skm,
          dskm,
          oo,
          oj,
          vz,
          fu,
          id,
        ]
      );
      res.json(updatedEntry.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async deleteAnthropometry(req, res) {
    const id = req.params.id;
    try {
      const deletedEntry = await db.query(
        `DELETE FROM anthropometry_bioimpedance WHERE id = $1 RETURNING *`,
        [id]
      );
      res.json(deletedEntry.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new AnthropometryController();
