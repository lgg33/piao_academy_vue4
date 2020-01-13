import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    // hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '后台管理系统', icon: 'dashboard' }
    }]
  },

  // 教师管理
  {
    path: '/edu/teacher',
    component: Layout,
    redirect: '/edu/teacher/list',
    name: 'Teacher',
    meta: { title: '教师管理', icon: 'peoples' },
    children: [
      {
        path: 'list',
        name: 'EduTeacherList',
        component: () => import('@/views/edu/teacher/list'),
        meta: { title: '教师列表' }
      },
      {
        path: 'create',
        name: 'EduTeacherCreate',
        component: () => import('@/views/edu/teacher/formTeacher'),
        meta: { title: '添加教师' }
      },
      {
        path: 'edit/:id',
        name: 'EduTeacherEdit',
        component: () => import('@/views/edu/teacher/formTeacher'),
        meta: { title: '编辑教师', noCache: true },
        hidden: true
      }
    ]
  },
  //分类管理
  {
    path: '/edu/subject',
    component: Layout,
    redirect: 'edu/subject/list',
    name: 'Subject',
    meta: { title: '课程分类管理', icon: 'nested' },
    children: [
      {
        path: 'list',
        name: 'SubjectList',
        component: () => import('@/views/edu/subject/subjectList'),
        meta: { title: '课程分类列表' }
      },
      {
        path: 'import',
        name: 'SubjectImport',
        component: () => import('@/views/edu/subject/import'),
        meta: { title: '导入课程分类' }
      }
    ]
  },
  //课程管理
  {
    path: '/edu/course',
    component: Layout,
    redirect: '/edu/course/list',
    name: 'Course',
    meta: { title: '课程管理', icon: 'form' },
    children: [
      {
        path: 'list',
        name: 'EduCourseList',
        component: () => import('@/views/edu/course/courseList'),
        meta: { title: '课程列表' }
      },
      {
        path: 'info',
        name: 'EduCourseInfo',
        component: () => import('@/views/edu/course/info'),
        meta: { title: '发布课程' }
      },
      {
        path: 'info/:id',
        name: 'EduCourseInfoEdit',
        component: () => import('@/views/edu/course/info'),
        meta: { title: '编辑课程基本信息', noCache: true },
        hidden: true
      },
      {
        path: 'summary/:id',
        name: 'EduCourseSummaryEdit',
        component: () => import('@/views/edu/course/summary'),
        meta: { title: '编辑课程大纲', noCache: true },
        hidden: true
      },
      {
        path: 'publish/:id',
        name: 'EduCoursePublishEdit',
        component: () => import('@/views/edu/course/publish'),
        meta: { title: '发布课程', noCache: true },
        hidden: true
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
];

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
