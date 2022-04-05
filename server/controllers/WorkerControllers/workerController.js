export const getDetails = async (req, res) => {
  const user = {
    first_name: req.user.first_name,
    middle_name: req.user.middle_name,
    last_name: req.user.family_name,
    suffix: req.user.suffix,
    email: req.user.email,
    mobile_no: req.user.mobile_no,
    address: req.user.address,
    birthdate: req.user.birthdate,
    sex: req.user.sex,
  };
  return res.status(200).json({ user });
};
