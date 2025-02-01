// script.js
const SUPABASE_URL = 'https://ssghoyjgxiwkjoiorgrz.supabase.co';
const SUPABASE_KEY = 'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzZ2hveWpneGl3a2pvaW9yZ3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MDIxNjUsImV4cCI6MjA1Mzk3ODE2NX0.DCSthQ8Bfd570a8AxmP_t5r2jLnhv7ZdPKnFKPTlrmc';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const loginForm = document.getElementById('login-form');
const todoSection = document.getElementById('todo-section');
const todoForm = document.getElementById('todo-form');
const todoList = document.getElementById('todo-list');
let currentUser = null;

// 登录/注册
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const { user, error } = await supabase.auth.signIn({ email });
  if (error) {
    alert(error.message);
  } else {
    currentUser = user;
    loginForm.style.display = 'none';
    todoSection.style.display = 'block';
    loadTodos();
  }
});

// 加载任务
async function loadTodos() {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('email', currentUser.email);
  if (error) {
    alert(error.message);
  } else {
    todoList.innerHTML = data.map(todo => `
      <li>
        <span>${todo.task}</span>
        <button onclick="deleteTodo('${todo.id}')">删除</button>
      </li>
    `).join('');
  }
}

// 添加任务
todoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const task = document.getElementById('task').value;
  const { data, error } = await supabase
    .from('todos')
    .insert([{ email: currentUser.email, task, completed: false }]);
  if (error) {
    alert(error.message);
  } else {
    loadTodos();
    todoForm.reset();
  }
});

// 删除任务
async function deleteTodo(id) {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id);
  if (error) {
    alert(error.message);
  } else {
    loadTodos();
  }
}
