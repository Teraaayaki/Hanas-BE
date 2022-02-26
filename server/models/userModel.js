import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    user_id: {
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
      unique: [true, '{VALUE} has already been taken.']
      // required: [true, 'Please enter a valid email address.']
    },
    password: {
      type: String,
      required: [
        true,
        'Please enter a strong password, minimum of 8 characters.'
      ],
      min: [8, 'Password must contain at least 8 characters']
    },
    mobile_no: {
      type: Number,
      required: [true, 'Please enter your mobile number.'],
      min: [11, 'Must be at least 11 digits']
    },
    telephone: {
      type: String
    },
    address: {
      type: String,
      required: [true, 'Please enter your address.']
    },
    birthdate: {
      type: Date,
      required: [true, 'Please enter your birthdate.']
    },
    gender: {
      type: String,
      enum: {
        values: ['Female', 'Male'],
        message: '{VALUE} is not supported.'
      },
      required: [true, 'Please choose your gender.']
    },
    is_worker: {
      type: Boolean,
      required: [true, 'is_worker field is required.'],
      default: false
    },
    is_verified: {
      type: Boolean,
      default: false
    },
    profile_pic: {
      type: String
    },
    valid_ID: {
      type: String
    },
    NBI_clearance: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('User', userSchema);
