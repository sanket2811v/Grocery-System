import multer from "multer";

const storage = multer.diskStorage({});
const upload = multer({ storage });

/** Only parse multipart when client sends multipart/form-data (JSON-only requests skip multer). */
export const uploadProductImages = (req, res, next) => {
  const ct = req.headers["content-type"] || "";
  if (ct.includes("multipart/form-data")) {
    return upload.array("images", 12)(req, res, next);
  }
  next();
};

export { upload };
