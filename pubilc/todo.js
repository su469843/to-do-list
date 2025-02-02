const SUPABASE_URL = 'https://ssghoyjgxiwkjoiorgrz.supabase.co';
const SUPABASE_KEY = 'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzZ2hveWpneGl3a2pvaW9yZ3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MDIxNjUsImV4cCI6MjA1Mzk3ODE2NX0.DCSthQ8Bfd570a8AxmP_t5r2jLnhv7ZdPKnFKPTlrmc';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const todoForm = document.getElementById('todo-form');
const todayList = document.getElementById('today-list');
const tomorrowList = document.getElementById('tomorrow-list');
const laterList = document.getElementById('later-list');

// 加载任务
async function loadTodos() {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', supabase.auth.user().id);
  if (error) {
    alert(error.message);
  } else {
    todayList.innerHTML = '';
    tomorrowList.innerHTML = '';
    laterList.innerHTML = '';

    data.forEach(todo => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="${todo.completed ? 'completed' : ''}">${todo.task}</span>
        <div>
          <button onclick="toggleComplete('${todo.id}', ${!todo.completed})">${todo.completed ? '取消完成' : '完成'}</button>
          <button onclick="deleteTodo('${todo.id}')">删除</button>
        </div>
      `;

      if (todo.category === 'today') {
        todayList.appendChild(li);
      } else if (todo.category === 'tomorrow') {
        tomorrowList.appendChild(li);
      } else if (todo.category === 'later') {
        laterList.appendChild(li);
      }
    });
  }
}

// 添加任务
todoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const task = document.getElementById('task').value;
  const category = document.getElementById('category').value;

  const { data, error } = await supabase
    .from('todos')
    .insert([{ user_id: supabase.auth.user().id, task, category, completed: false }]);
  if (error) {
    alert(error.message);
  } else {
    loadTodos();
    todoForm.reset();
  }
});

// 切换任务完成状态
async function toggleComplete(id, completed) {
  const { error } = await supabase
    .from('todos')
    .update({ completed })
    .eq('id', id);
  if (error) {
    alert(error.message);
  } else {
    loadTodos();
  }
}

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

// 初始化加载任务
loadTodos();
