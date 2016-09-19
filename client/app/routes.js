import React from 'react'
import { Route, IndexRoute } from 'react-router'

import AppLayout from './layouts/app'
import requireAuthentication from './components/auth/protected_route';

import UserList from './views/user/list'
import UserProfile from './views/user/profile'

import SkillList from './views/skill/list'

import AuthLogin from './views/auth/login'
import AuthRegister from './views/auth/register'

export default (
  <Route path="/" component={AppLayout}>
    <IndexRoute component={requireAuthentication(UserList)} />
    <Route path="user/:id" component={requireAuthentication(UserProfile)} />
    <Route path="skill/:id" component={requireAuthentication(SkillList)} />
    <Route path="login" component={AuthLogin} />
    <Route path="register" component={AuthRegister} />
  </Route>
);
