const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Task = require('../models/task');
const auth = require('../middleware/auth');

// 创建新任务
router.post('/', [
  auth,
  body('title').trim().notEmpty().withMessage('任务标题不能为空'),
  body('description').optional().trim(),
  body('dueDate').optional().isISO8601().toDate().withMessage('无效的日期格式'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('无效的优先级'),
  body('tags').optional().isArray().withMessage('标签必须是数组格式')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = new Task({
      ...req.body,
      owner: req.user._id
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: '创建任务失败' });
  }
});

// 获取用户的所有任务
router.get('/', auth, async (req, res) => {
  try {
    const match = {};
    const sort = {};

    // 状态筛选
    if (req.query.status) {
      match.status = req.query.status;
    }

    // 优先级筛选
    if (req.query.priority) {
      match.priority = req.query.priority;
    }

    // 排序
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    const tasks = await Task.find({
      owner: req.user._id,
      ...match
    })
    .sort(sort)
    .exec();

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: '获取任务列表失败' });
  }
});

// 获取特定任务
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: '任务不存在' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: '获取任务详情失败' });
  }
});

// 更新任务
router.patch('/:id', [
  auth,
  body('title').optional().trim().notEmpty().withMessage('任务标题不能为空'),
  body('status').optional().isIn(['pending', 'in_progress', 'completed']).withMessage('无效的状态'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('无效的优先级')
], async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'dueDate', 'status', 'priority', 'tags'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: '无效的更新字段' });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: '任务不存在' });
    }

    updates.forEach(update => task[update] = req.body[update]);
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: '更新任务失败' });
  }
});

// 删除任务
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: '任务不存在' });
    }

    res.json({ message: '任务已删除', task });
  } catch (error) {
    res.status(500).json({ message: '删除任务失败' });
  }
});

// 共享任务
router.post('/:id/share', [
  auth,
  body('userId').notEmpty().withMessage('请提供要共享的用户ID')
], async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: '任务不存在' });
    }

    if (task.sharedWith.includes(req.body.userId)) {
      return res.status(400).json({ message: '该任务已经与此用户共享' });
    }

    task.sharedWith.push(req.body.userId);
    await task.save();

    res.json({ message: '任务共享成功', task });
  } catch (error) {
    res.status(500).json({ message: '共享任务失败' });
  }
});

module.exports = router;