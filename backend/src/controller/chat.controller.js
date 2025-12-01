import { generateStreamToken } from "../lib/stream.js";

export const getStreamToken = async (req, res) => {
  try {
    const token = await generateStreamToken(req.user._id);

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Error generating stream token:", error);
    return res.status(500).json({ message: "Server error." });
  }
};
