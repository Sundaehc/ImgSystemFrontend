export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
    ],

  },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/tag'},
      { name: '标签管理', icon: 'table', path: '/admin/tag', component: './Admin/Tag' },
      { name: '图片上传', icon: 'table', path: '/admin/image', component: './Admin/Image' },
    ],
  },

  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
