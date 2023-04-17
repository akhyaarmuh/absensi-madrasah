import { __dirname } from './index.js';
import fs from 'fs';
import Absent_Detail from '../models/Absent_Detail.js';
import Absent from '../models/Absent.js';
import Classroom from '../models/Classroom.js';
import Student from '../models/Classroom.js';
import Teacher from '../models/Classroom.js';
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
  const absentDetails = await Absent_Detail.find().exec();
  const absents = await Absent.find().exec();
  const classrooms = await Classroom.find().exec();
  const students = await Student.find().exec();
  const teachers = await Teacher.find().exec();
  const users = await User.find().exec();

  const newAbsentDetails = [];
  const newAbsents = [];
  const newClasrooms = [];
  const newStudents = [];
  const newTeachers = [];
  const newUsers = [];

  for (const absentDetail of absentDetails) {
    newAbsentDetails.push(absentDetail);
  }
  for (const absent of absents) {
    newAbsents.push(absent);
  }
  for (const classroom of classrooms) {
    newClasrooms.push(classroom);
  }
  for (const student of students) {
    newStudents.push(student);
  }
  for (const teacher of teachers) {
    newTeachers.push(teacher);
  }
  for (const user of users) {
    newUsers.push(user);
  }

  const backup = {
    absent_details: newAbsentDetails,
    absents: newAbsents,
    classrooms: newClasrooms,
    students: newStudents,
    teachers: newTeachers,
    users: newUsers,
  };

  fs.writeFileSync(`${__dirname}/backup.json`, JSON.stringify(backup));
};

export const restoreDatabase = async () => {
  const rawdata = fs.readFileSync(`${__dirname}/backup.json`);
  const database = JSON.parse(rawdata);

  for (const absentDetail of database.absent_details) {
    const doc = new Absent_Detail(absentDetail);
    await doc.save({ validateBeforeSave: false });
  }

  for (const absent of database.absents) {
    const doc = new Absent(absent);
    await doc.save({ validateBeforeSave: false });
  }

  for (const classroom of database.classrooms) {
    const doc = new Classroom(classroom);
    await doc.save({ validateBeforeSave: false });
  }

  for (const student of database.students) {
    const doc = new Student(student);
    await doc.save({ validateBeforeSave: false });
  }

  for (const teacher of database.teachers) {
    const doc = new Teacher(teacher);
    await doc.save({ validateBeforeSave: false });
  }

  for (const user of database.users) {
    const doc = new User(user);
    await doc.save({ validateBeforeSave: false });
  }
};
