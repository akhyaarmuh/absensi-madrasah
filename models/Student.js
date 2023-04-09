import fs from 'fs';
import mongoose from 'mongoose';
const { Schema, model, ObjectId } = mongoose;

import { __dirname } from '../utilities/index.js';

const studentSchema = new Schema(
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
          const count = await mongoose.models.Student.countDocuments({
            no_induk: new RegExp(`^${value}$`, 'i'),
            _id: { $ne: _id },
          });
          return !count;
        },
        message: 'NIS sudah digunakan',
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
      required: true,
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
      type: String,
      default: 'aktif',
      enum: ['aktif', 'berhenti', 'lulus'],
    },
    image: {
      type: String,
      trim: true,
    },
    classroom: {
      type: ObjectId,
      ref: 'Classroom',
      required: true,
      index: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      UpdatedAt: 'updated_at',
    },
  }
);

studentSchema.pre('deleteOne', async function (next) {
  await mongoose.models.Absent_Detail.deleteMany({ id_student: this._conditions._id });

  // hapus gambar jika ada
  const deletingStudent = await mongoose.models.Student.findOne(this._conditions);
  if (deletingStudent.image)
    fs.unlinkSync(`${__dirname}/public/images/${deletingStudent.image}`);

  next();
});

export default model('Student', studentSchema);
