import Booking from '../../models/bookingModel.js';

export const getTransactions = async (req, res) => {
  const transactions = await Booking.find({
    worker: req.user._id,
    book_status: 'Finished',
  })
    .populate('client', 'first_name middle_name family_name suffix address')
    .populate({
      path: 'service_availed',
      populate: {
        path: 'service',
      },
    })
    .sort({ booked_dateTimeStart: 'asc' });

  return res.status(200).json({ transactions });
};
