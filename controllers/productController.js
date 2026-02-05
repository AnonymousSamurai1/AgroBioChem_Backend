const Product = require('../models/productModel');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('Invalid image type');

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, 'public/uploads');
  },

  filename: function (req, file, cb) {
    const fileName = file.originalname.replace(' ', '-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

exports.getAllProducts = async (req, res) => {
  try {
    let query = {};

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
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
      const sortFields = req.query.sort.split(',');

      sortFields.forEach((field) => {
        if (field.startsWith('-')) {
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

exports.createProduct =
  (uploadOptions.single('image'),
  async (req, res) => {
    try {
      const { name, description, category, categoryType, ingredient } =
        req.body;
      const fileName = req.file.filename;
      const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
      const product = await Product.create({
        name,
        description,
        category,
        categoryType,
        image: `${basePath}${fileName}`,
        ingredient,
      });
      res.status(201).json({ success: true, msg: 'Product created', product });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, msg: "Product not found" });
    }
    let imagePath = product.image;
    if (req.file) {
      if (product.image) {
        const oldImagePath = path.join(__dirname, "..", product.image.replace(`${req.protocol}://${req.get("host")}`, ""));
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Error deleting old image:", err);
        });
      }
      const fileName = req.file.filename;
      const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
      imagePath = `${basePath}${fileName}`;
    }

    product = await Product.findByIdAndUpdate(req.params.id, {...req.body, image: imagePath,},
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      msg: "Product updated",
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Error updating Product", error });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, msg: 'Product not found' });
    }
    if (product.image) {
      const imagePath = path.join(
        __dirname,
        '..',
        product.image.replace(`${req.protocol}://${req.get('host')}`, '')
      );

      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting image:', err);
        } else {
          console.log('Image deleted:', imagePath);
        }
      });
    }

    res.status(200).json({
      success: true,
      msg: `Product with id: ${req.params.id} deleted`,
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, msg: 'Error deleting Product', error });
  }
};

exports.uploadProducts =
  (uploadOptions.array('images', 10),
  async (req, res) => {
    try {
      const files = req.files;
      let imagePaths = [];
      const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;

      if (files) {
        files.map((file) => {
          imagePaths.push(`${basePath}${file.fileName}`);
        });
      }
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { images: imagesPaths },
        {
          new: true,
        }
      );
      if (!product) {
        return res
          .status(404)
          .json({ success: false, msg: 'Product not found' });
      }
      res.status(200).json({ success: true, msg: 'Product updated', product });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, msg: 'Error updating Product', error });
    }
  });

exports.uploadSingle = uploadOptions.single('image');
exports.uploadMultiple = uploadOptions.array('images', 10);
