const API_URL = 'https://api.yourdomain.com'; // 替换为你的 Workers URL
let currentUser = null;

// 登录/注册
async function login(email) {
  const response = await fetch(`${API_URL}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (data.success) {
    currentUser = { email, token: data.token }; // 保存用户信息和令牌
    window.location.href = 'todo.html'; // 跳转到 To-Do List 页面
  }
}

// 获取任务列表
async function loadTodos() {
  const response = await fetch(`${API_URL}/todos`, {
    headers: {
      'Authorization': `Bearer ${currentUser.token}`,
    },
  });
  const data = await response.json();
  const todoList = document.getElementById('todo-list');
  todoList.innerHTML = data.todos.map((todo, index) => `
    <li class="${todo.completed ? 'completed' : ''}">
      <span>${todo.task}</span>
      <div>
        <button onclick="toggleComplete(${index}, ${!todo.completed})">
          ${todo.completed ? '取消完成' : '完成'}
        </button>
        <button onclick="deleteTodo(${index})">删除</button>
      </div>
    </li>
  `).join('');
}

// 添加任务
async function addTodo(task) {
  const response = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${currentUser.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ task }),
  });
  const data = await response.json();
  if (data.success) {
    loadTodos(); // 重新加载任务列表
  }
}

// 更新任务状态
async function toggleComplete(taskIndex, completed) {
  const response = await fetch(`${API_URL}/todos`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${currentUser.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ taskIndex, completed }),
  });
  const data = await response.json();
  if (data.success) {
    loadTodos(); // 重新加载任务列表
  }
}

// 删除任务
async function deleteTodo(taskIndex) {
  const response = await fetch(`${API_URL}/todos`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${currentUser.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ taskIndex }),
  });
  const data = await response.json();
  if (data.success) {
    loadTodos(); // 重新加载任务列表
  }
}

// 绑定事件
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  login(email);
});

document.getElementById('register-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('register-email').value;
  login(email); // 注册后直接登录
});

document.getElementById('todo-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const task = document.getElementById('task').value;
  addTodo(task);
});

// 初始化加载任务
if (currentUser) {
  loadTodos();
}
