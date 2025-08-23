import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    image: { type: String, default: 'https://placehold.co/600x400' },
    price: { type: Number, required: true, min: 0 },
    countInStock: { type: Number, default: 0 },
    brand: { type: String, default: '' },
    category: { type: String, default: 'general' }
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);