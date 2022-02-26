import mongoose from 'mongoose';

const adminSchema = mongoose.Schema(
  {
    admin_id: {
      type: String,
      unique: true,
      required: true
    },
    employee_id: {
      type: String,
      unique: true,
      required: true
    },
    first_name: {
      type: String,
      required: [true, 'Please enter your first name.']
    },
    middle_name: {
      type: String,
      required: [true, 'Please enter your middle name.']
    },
    family_name: {
      type: String,
      required: [true, 'Please enter your family name.']
    },
    suffix: {
      type: String
    },
    email: {
      type: String,
      unique: [true, '{VALUE} has already been taken.'],
      required: [true, 'Please enter a valid email address.']
    },
    password: {
      type: String,
      required: [
        true,
        'Please enter a strong password, minimum of 8 characters.'
      ],
      min: [8, 'Password must contain at least 8 characters, got {VALUE}']
    },
    mobile_no: {
      type: Number,
      required: [true, 'Please enter your mobile number.'],
      min: [11, 'Must be at least 11 digits, got {VALUE}']
    },
    telephone: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Admin', adminSchema);
