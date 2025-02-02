export default {
    async fetch(request, env) {
      const url = new URL(request.url);
      const path = url.pathname;
      const method = request.method;
  
      // 验证 API 令牌
      const token = request.headers.get('Authorization')?.replace('Bearer ', '');
      if (!token && path !== '/auth') {
        return new Response('Unauthorized', { status: 401 });
      }
  
      // 登录/注册
      if (path === '/auth' && method === 'POST') {
        const { email } = await request.json();
        const token = generateToken(email); // 生成令牌
        await env.TODOS.put(`user:${email}`, JSON.stringify({ email, todos: [] }));
        return new Response(JSON.stringify({ success: true, token }), { status: 200 });
      }
  
      // 获取任务列表
      if (path === '/todos' && method === 'GET') {
        const email = verifyToken(token); // 验证令牌
        const todos = await env.TODOS.get(`user:${email}`);
        return new Response(todos, { status: 200 });
      }
  
      // 添加任务
      if (path === '/todos' && method === 'POST') {
        const email = verifyToken(token); // 验证令牌
        const { task } = await request.json();
        const userData = await env.TODOS.get(`user:${email}`);
        const user = JSON.parse(userData);
        user.todos.push({ task, completed: false });
        await env.TODOS.put(`user:${email}`, JSON.stringify(user));
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }
  
      // 更新任务状态
      if (path === '/todos' && method === 'PUT') {
        const email = verifyToken(token); // 验证令牌
        const { taskIndex, completed } = await request.json();
        const userData = await env.TODOS.get(`user:${email}`);
        const user = JSON.parse(userData);
        user.todos[taskIndex].completed = completed;
        await env.TODOS.put(`user:${email}`, JSON.stringify(user));
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }
  
      // 删除任务
      if (path === '/todos' && method === 'DELETE') {
        const email = verifyToken(token); // 验证令牌
        const { taskIndex } = await request.json();
        const userData = await env.TODOS.get(`user:${email}`);
        const user = JSON.parse(userData);
        user.todos.splice(taskIndex, 1);
        await env.TODOS.put(`user:${email}`, JSON.stringify(user));
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }
  
      return new Response('Not Found', { status: 404 });
    },
  };
  
  // 生成令牌
  function generateToken(email) {
    return btoa(email + ':' + Date.now()); // 简单示例，实际应使用更安全的算法
  }
  
  // 验证令牌
  function verifyToken(token) {
    const [email] = atob(token).split(':'); // 简单示例，实际应使用更安全的算法
    return email;
  }