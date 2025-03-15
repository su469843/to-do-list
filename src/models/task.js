const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  dueDate: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending'
  },
  tags: [{
    type: String,
    trim: true
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  sharedWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// 创建索引以提高查询性能
taskSchema.index({ owner: 1, status: 1 });
taskSchema.index({ dueDate: 1 });

// 任务完成时自动更新completedAt字段
taskSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed') {
    this.completedAt = new Date();
  }
  next();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;