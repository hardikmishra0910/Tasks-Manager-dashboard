const mongoose = require('mongoose');

/**
 * Task Schema for MongoDB
 * Defines the structure and validation rules for task documents
 */
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    minlength: [1, 'Task title cannot be empty'],
    maxlength: [200, 'Task title cannot exceed 200 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['Pending', 'Completed'],
      message: 'Status must be either Pending or Completed'
    },
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
  toJSON: { virtuals: true }, // Include virtuals when converting to JSON
  toObject: { virtuals: true }
});

// Index for better query performance
taskSchema.index({ status: 1, createdAt: -1 });
taskSchema.index({ title: 'text' }); // Text index for search functionality

// Virtual for task age (how long ago it was created)
taskSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // Days
});

// Pre-save middleware to update the updatedAt field
taskSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = Date.now();
  }
  next();
});

// Static method to get task statistics
taskSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    total: 0,
    pending: 0,
    completed: 0
  };
  
  stats.forEach(stat => {
    result.total += stat.count;
    if (stat._id === 'Pending') {
      result.pending = stat.count;
    } else if (stat._id === 'Completed') {
      result.completed = stat.count;
    }
  });
  
  return result;
};

// Instance method to toggle task status
taskSchema.methods.toggleStatus = function() {
  this.status = this.status === 'Pending' ? 'Completed' : 'Pending';
  return this.save();
};

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;