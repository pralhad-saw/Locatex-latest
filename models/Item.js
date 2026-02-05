const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ["lost", "found"], required: true },
  
  // --- Fields that will be HIDDEN by default ---
  contact: { 
    type: String, 
    // contact is now conditionally visible, not strictly required upfront for all types
    // We'll manage its visibility via isContactVisible and claim status.
  },
  
  // --- NEW FIELDS FOR SECURITY & VERIFICATION ---
  
  // For 'lost' items: the owner provides a secret detail.
  // For 'found' items: the finder provides a secret detail.
  // This detail is used by the other party to prove ownership.
  secretVerificationDetail: { 
    type: String, 
    required: true 
  },

  // The ID of the user who originally posted the item (owner)
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  
  // Status of the item: 'available', 'pending_claim', 'claimed', 'recovered', 'unclaimed', 'removed_by_admin'
  status: { 
    type: String, 
    default: 'available', // Initially available for claims/recovery
    enum: ['available', 'pending_claim', 'claimed', 'recovered', 'unclaimed', 'removed_by_admin'] 
  },
  
  // Whether the contact information is visible to the public.
  // This will be set to 'true' only after a claim is verified and approved.
  isContactVisible: { 
    type: Boolean, 
    default: false 
  },
  
  // Array to store all claim requests for this item.
  claims: [{
    requesterId: { // The user who is claiming the item (either owner or finder)
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    proofDescription: { // The proof of ownership submitted by the requester
      type: String, 
      required: true 
    },
    // Status of the claim: 'pending', 'rejected', 'accepted'
    status: { 
      type: String, 
      default: 'pending', 
      enum: ['pending', 'rejected', 'accepted'],
      required: true
    },
    claimedAt: { type: Date, default: Date.now } // When the claim was submitted
  }],
  
  image: String,
  location: { 
    type: String, 
    required: true, // Location must be provided
    trim: true 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now } // Good practice to track updates**
});

// Middleware to update 'updatedAt' field before saving
itemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Item", itemSchema);