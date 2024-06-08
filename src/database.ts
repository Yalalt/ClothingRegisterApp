// src/database.ts
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('clothing_registry.db');

export const createTables = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        code TEXT,
        quantity INTEGER,
        price REAL,
        total_price REAL,
        createdAt TEXT,
        updatedAt TEXT,
        image_uri TEXT
      );`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS temp_products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        code TEXT,
        quantity INTEGER,
        price REAL,
        total_price REAL,
        createdAt TEXT,
        updatedAt TEXT,
        image_uri TEXT
      );`
    );
  });
};

export default db;