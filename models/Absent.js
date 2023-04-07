import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const absentSchema = new Schema(
  {
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      UpdatedAt: 'updated_at',
    },
  }
);

absentSchema.pre('deleteOne', async function (next) {
  const absentDetailsDeleted = await mongoose.models.Absent_Detail.find({
    id_absent: this._conditions._id,
  }).exec();

  for (const absentDetail of absentDetailsDeleted) {
    await mongoose.models.Absent_Detail.deleteOne({ _id: absentDetail._id }).exec();
  }

  next();
});

export default model('Absent', absentSchema);
