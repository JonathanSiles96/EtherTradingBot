const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');

const apiKeySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    exchange: {
      type: String,
      required: true,
      default: 'binance',
    },
    apiKey: {
      type: String,
      required: true,
    },
    apiSecret: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

apiKeySchema.pre('save', function (next) {
  if (!this.isModified('apiSecret')) return next();
  const key = process.env.ENCRYPTION_KEY;
  this.apiSecret = CryptoJS.AES.encrypt(this.apiSecret, key).toString();
  next();
});

apiKeySchema.methods.getDecryptedSecret = function () {
  const key = process.env.ENCRYPTION_KEY;
  const bytes = CryptoJS.AES.decrypt(this.apiSecret, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = mongoose.model('ApiKey', apiKeySchema);
