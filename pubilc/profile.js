const SUPABASE_URL = 'https://ssghoyjgxiwkjoiorgrz.supabase.co';
const SUPABASE_KEY = 'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzZ2hveWpneGl3a2pvaW9yZ3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MDIxNjUsImV4cCI6MjA1Mzk3ODE2NX0.DCSthQ8Bfd570a8AxmP_t5r2jLnhv7ZdPKnFKPTlrmc';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const profileForm = document.getElementById('profile-form');

// 加载用户信息
async function loadProfile() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', supabase.auth.user().id)
    .single();
  if (error) {
    alert(error.message);
  } else {
    document.getElementById('email').value = data.email;
    document.getElementById('username').value = data.username;
  }
}

// 保存用户信息
profileForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;

  const { error } = await supabase
    .from('profiles')
    .update({ email, username })
    .eq('user_id', supabase.auth.user().id);
  if (error) {
    alert(error.message);
  } else {
    alert('个人信息已更新！');
  }
});

// 初始化加载用户信息
loadProfile();
