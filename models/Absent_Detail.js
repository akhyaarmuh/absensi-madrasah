import mongoose from 'mongoose';
const { Schema, model, ObjectId } = mongoose;

const absentDetailSchema = new Schema(
  {
    id_absent: {
      type: ObjectId,
      ref: 'Absent',
      required: true,
      index: true,
    },
    id_teacher: {
      type: ObjectId,
      ref: 'Teacher',
      index: true,
      validate: {
        validator: async function (value) {
          const _id = this.get('_id');
          const id_absent = this.get('id_absent');
          const count = await mongoose.models.Absent_Detail.countDocuments({
            id_absent,
            id_teacher: value,
            _id: { $ne: _id },
          }).exec();
          return !count;
        },
        message: 'Mudaris sudah berhasil absen',
      },
    },
    id_student: {
      type: ObjectId,
      ref: 'Student',
      index: true,
      validate: {
        validator: async function (value) {
          const _id = this.get('_id');
          const id_absent = this.get('id_absent');
          const count = await mongoose.models.Absent_Detail.countDocuments({
            id_absent,
            id_student: value,
            _id: { $ne: _id },
          }).exec();
          return !count;
        },
        message: 'Santri sudah berhasil absen',
      },
    },
    in: {
      type: Date,
      default: Date.now,
      required: true,
    },
    out: {
      type: Date,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
      index: true,
    },
    status: {
      type: String,
      default: 'hadir',
      enum: ['hadir', 'izin', 'sakit', 'pending', 'lebih awal'],
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['student', 'teacher'],
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

absentDetailSchema.pre('deleteOne', async function (next) {
  const absentDetailsDeleted = await mongoose.models.Absent_Detail.find({
    id_absent: this._conditions._id,
  }).exec();

  for (const absentDetail of absentDetailsDeleted) {
    await mongoose.models.Absent_Detail.deleteOne({ _id: absentDetail._id }).exec();
  }

  next();
});

export default model('Absent_Detail', absentDetailSchema);
