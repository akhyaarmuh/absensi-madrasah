import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const classroomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: [25, 'Panjang maksimal 25 karakter'],
      match: [/^[a-zA-Z0-9\s]*$/, 'Data tidak benar (hanya huruf dan angka)'],
      validate: {
        validator: async function (value) {
          const _id = this.get('_id').toString();
          const count = await mongoose.models.Classroom.countDocuments({
            name: new RegExp(`^${value}$`, 'i'),
            _id: { $ne: _id },
          }).exec();
          return !count;
        },
        message: 'Kelas sudah ada',
      },
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      UpdatedAt: 'updated_at',
    },
  }
);

classroomSchema.pre('deleteOne', async function (next) {
  const studentsDeleted = await mongoose.models.Student.find({
    classroom: this._conditions._id,
  }).exec();

  for (const student of studentsDeleted) {
    await mongoose.models.Student.deleteOne({ _id: student._id }).exec();
  }

  next();
});

export default model('Classroom', classroomSchema);
