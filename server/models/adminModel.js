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
      unique: [true, '{VALUE} is already taken.'],
      required: [true, 'Please enter a valid email address.']
    },
    password: {
      type: String,
      required: [
        true,
        'Please enter a strong password, minimum of 8 characters.'
      ],
      min: [8, 'Password must contain at least 8 characters.']
    },
    mobile_no: {
      type: Number,
      unique: [true, '{VALUE} is already taken.'],
      required: [true, 'Please enter your mobile number.'],
      min: [11, 'Must be at least 11 digits']
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
