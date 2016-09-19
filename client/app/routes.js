import React from 'react'
import { Route, IndexRoute } from 'react-router'

import AppLayout from './layouts/app'
import requireAuthentication from './components/auth/protected_route';
import UserList from './views/user/list'
import SkillList from './views/skill/list'
import UserProfile from './views/user/profile'
import AuthLogin from './views/auth/login'
// import UserRegister from './views/user/register'

export default (
  <Route path="/" component={AppLayout}>
    <IndexRoute component={requireAuthentication(UserList)} />
    <Route path="user/:id" component={requireAuthentication(UserProfile)} />
    <Route path="skill/:id" component={requireAuthentication(SkillList)} />
    <Route path="login" component={AuthLogin} />
  </Route>
);
