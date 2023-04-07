import fs from 'fs';
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

import { __dirname } from '../utilities/index.js';

const teacherSchema = new Schema(
  {
    no_induk: {
      type: String,
      required: true,
      trim: true,
      index: true,
      match: [/^\d+$/, 'No induk tidak benar (hanya nomor)'],
      validate: {
        validator: async function (value) {
          const _id = this.get('_id');
          const count = await mongoose.models.Teacher.countDocuments({
            no_induk: new RegExp(`^${value}$`, 'i'),
            _id: { $ne: _id },
          });
          return !count;
        },
        message: 'NIM sudah digunakan',
      },
    },
    full_name: {
      type: String,
      required: true,
      trim: true,
      index: true,
      minLength: [3, 'Terlalu pendek, setidaknya 3 karakter'],
      maxLength: [25, 'Panjang maksimal 25 karakter'],
      match: [/^[a-zA-Z\s]*$/, 'Masukan nama yang benar (hanya huruf)'],
    },
    birth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['laki-laki', 'perempuan'],
    },
    parent_name: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, 'Terlalu pendek, setidaknya 3 karakter'],
      maxLength: [25, 'Panjang maksimal 25 karakter'],
      match: [/^[a-zA-Z\s]*$/, 'Masukan nama yang benar (hanya huruf)'],
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Number,
      default: 1,
    },
    image: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      UpdatedAt: 'updated_at',
    },
  }
);

teacherSchema.pre('deleteOne', async function (next) {
  await mongoose.models.Absent_Detail.deleteMany({ id_teacher: this._conditions._id });

  // hapus gambar jika ada
  const deletingTeacher = await mongoose.models.Teacher.findOne(this._conditions);
  if (deletingTeacher.image)
    fs.unlinkSync(`${__dirname}/public/images/${deletingTeacher.image}`);

  next();
});

export default model('Teacher', teacherSchema);
