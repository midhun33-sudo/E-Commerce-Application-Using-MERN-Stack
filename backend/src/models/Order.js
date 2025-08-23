import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        price: Number,
        qty: Number,
        image: String
      }
    ],
    total: { type: Number, required: true },
    status: { type: String, default: 'PLACED' },
    paymentMethod: { type: String, default: 'COD' }
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);