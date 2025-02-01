const SUPABASE_URL = 'https://ssghoyjgxiwkjoiorgrz.supabase.co';
const SUPABASE_KEY = 'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzZ2hveWpneGl3a2pvaW9yZ3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MDIxNjUsImV4cCI6MjA1Mzk3ODE2NX0.DCSthQ8Bfd570a8AxmP_t5r2jLnhv7ZdPKnFKPTlrmc';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// 登录
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const { user, error } = await supabase.auth.signIn({ email, password });
  if (error) {
    alert(error.message);
  } else {
    alert('登录成功！');
    window.location.href = 'todo.html'; // 跳转到 To-Do List 页面
  }
});

// 注册
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const username = document.getElementById('register-username').value;

  const { user, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    alert(error.message);
  } else {
    alert('注册成功！请检查邮箱以验证账户。');
    window.location.href = 'index.html'; // 跳转到登录页面
  }
});
