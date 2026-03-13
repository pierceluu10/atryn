import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = path.join(process.cwd(), "atryn.db");

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initTables(db);
    seedIfEmpty(db);
  }
  return db;
}

function initTables(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      program TEXT NOT NULL,
      year INTEGER NOT NULL,
      interests TEXT NOT NULL DEFAULT '',
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS professors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      department TEXT NOT NULL,
      labName TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS labs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      labName TEXT NOT NULL,
      professorId INTEGER,
      topics TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      department TEXT NOT NULL DEFAULT '',
      FOREIGN KEY (professorId) REFERENCES professors(id)
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      studentId INTEGER NOT NULL,
      labId TEXT NOT NULL,
      videoUrl TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (studentId) REFERENCES students(id)
    );
  `);
}

function seedIfEmpty(db: Database.Database) {
  const count = db.prepare("SELECT COUNT(*) as c FROM labs").get() as { c: number };
  if (count.c > 0) return;

  const seedPath = path.join(process.cwd(), "data", "seed-labs.json");
  if (!fs.existsSync(seedPath)) return;

  const seedData = JSON.parse(fs.readFileSync(seedPath, "utf-8"));
  const bcrypt = require("bcryptjs");

  const insertProf = db.prepare(
    "INSERT INTO professors (name, email, password, department, labName) VALUES (?, ?, ?, ?, ?)"
  );
  const insertLab = db.prepare(
    "INSERT INTO labs (labName, professorId, topics, description, department) VALUES (?, ?, ?, ?, ?)"
  );

  const seedTransaction = db.transaction(() => {
    for (const item of seedData) {
      const hashedPassword = bcrypt.hashSync("password123", 10);
      const profResult = insertProf.run(
        item.professorName,
        item.professorEmail,
        hashedPassword,
        item.department,
        item.labName
      );
      insertLab.run(
        item.labName,
        profResult.lastInsertRowid,
        item.topics,
        item.description,
        item.department
      );
    }
  });

  seedTransaction();
}
