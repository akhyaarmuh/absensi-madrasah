import mongoose from 'mongoose';
import Student from './models/Student.js';

try {
  mongoose.set('strictQuery', false);
  await mongoose.connect('mongodb://127.0.0.1:27017/madrasah');
  console.log('Database Connected');

  await Student.updateMany({}, { status: 'aktif' });

  console.log('Everything is ok');
} catch (error) {
  console.error(error);
}
