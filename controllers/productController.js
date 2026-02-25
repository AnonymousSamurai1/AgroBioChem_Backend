const Product = require("../models/productModel");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

exports.getAllProducts = async (req, res) => {
  try {
    let query = {};

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }

    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.categoryType) {
      query.categoryType = req.query.categoryType;
    }

    let sort = {};
    if (req.query.sort) {
      const sortFields = req.query.sort.split(",");

      sortFields.forEach((field) => {
        if (field.startsWith("-")) {
          sort[field.substring(1)] = -1;
        } else {
          sort[field] = 1;
        }
      });
    } else {
      sort = { createdAt: -1 };
    }
    const products = await Product.find(query).sort(sort);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        msg: `Product with id of ${req.params.id} not found`,
      });
    }
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.createProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required"
      });
    }
    const result = await cloudinary.uploader.upload(req.file.path);

    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      categoryType: req.body.categoryType,
      image: result.secure_url,
      ingredient: req.body.ingredient,
      cloudinary_id: result.public_id,
    });

    res.status(201).json({
      success: true,
      msg: "Product created",
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, msg: "Product not found" });
    }
    let imagePath = product.image;
    if (req.file) {
      if (product.image) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          product.image.replace(`${req.protocol}://${req.get("host")}`, ""),
        );
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Error deleting old image:", err);
        });
      }
      const fileName = req.file.filename;
      const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
      imagePath = `${basePath}${fileName}`;
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, image: imagePath },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      msg: "Product updated",
      product,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, msg: "Error updating Product", error });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    let product = await Product.findByIdAndDelete(req.params.id);
    await cloudinary.uploader.destroy(product.cloudinary_id);

    res.status(200).json({
      success: true,
      msg: `Product with id: ${req.params.id} deleted`,
    });
    if (!product) {
      return res.status(404).json({ success: false, msg: "Product not found" });
    }
  } catch (error) {
    res
      .status(400)
      .json({ success: false, msg: "Error deleting Product", error });
  }
};
