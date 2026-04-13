import Address from "../models/addressModel.js";

export const addAddress = async (req, res) => {
  try {
    const { address, userId } = req.body;
    const finalUserId = userId ?? req.userId;

    if (!finalUserId || !address) {
      return res.json({ success: false, message: "Missing userId or address" });
    }

    await Address.createAddress({
      userId: finalUserId,
      firstName: address.firstName,
      lastName: address.lastName,
      email: address.email,
      street: address.street,
      city: address.city,
      state: address.state,
      zipcode: address.zipcode,
      country: address.country,
      phone: address.phone,
    });

    return res.json({ success: true, message: "Address added successfully" });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const getAddress = async (req, res) => {
  try {
    const { userId } = req.body;
    const finalUserId = userId ?? req.userId;

    if (!finalUserId) {
      return res.json({ success: false, message: "Not Authorized" });
    }

    const addresses = await Address.getAddressesByUserId(finalUserId);
    return res.json({ success: true, addresses });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

