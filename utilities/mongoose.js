import { __dirname } from './index.js';
import fs from 'fs';
import User from '../models/User.js';

export const errorValidation = (error) => {
  const errors = {};
  const detailErrors = error.errors;

  for (const property in detailErrors) {
    errors[property] = detailErrors[property].message;
  }

  return errors;
};

export const backupDatabase = async () => {
  const users = await User.find().exec();

  const newUsers = [];

  for (const user of users) {
    newUsers.push(user);
  }

  const backup = {
    users: newUsers,
  };

  fs.writeFileSync(`${__dirname}/backup.json`, JSON.stringify(backup));
};

export const restoreDatabase = async () => {
  const rawdata = fs.readFileSync(`${__dirname}/backup.json`);
  const database = JSON.parse(rawdata);

  for (const user of database.users) {
    const doc = new User(user);
    await doc.save({ validateBeforeSave: false });
  }
};
