import React, { useState } from 'react'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Login from './Components/Login/Login'
import Nav from './Components/Nav/Nav'
import Dashboard from './Components/Dashboard/Dashboard'
import Books from './Components/Books/Books'
import Borrow from './Components/Borrow/Borrow'
import Request from './Components/Request/Request'
import UserManagement from './Components/UserManagement/UserManagement'
import Reserve from './Components/Reserve/Reserve'
import ProjectAllocate from './Components/ProjectAllocate/ProjectAllocate'
import Reports from './Components/Reports/Reports'
import TaskAllocate from './Components/TaskAllocate/TaskManagement'
import Feedback from './Components/Feedback/Feedback'
import ProjectStatus from './Components/ProjectAllocate/ProjectStatus'
import LeadAllocation from './Components/ProjectAllocate/LeadAllocation'
export default function App() {
  const [ data, setData ] = useState('')
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Login} />
        <Switch>
          <Route path="/" exact component={Login} />
          <Switch>
            <Route path="/dashboard" exact>
              <Nav>
                <Dashboard />
              </Nav>
            </Route>
            <Route path="/books" exact>
              <Nav>
                <Books />
              </Nav>
            </Route>
            <Route path="/borrow" exact>
              <Nav>
                <Borrow />
              </Nav>
            </Route>
            <Route path="/reserve" exact>
              <Nav>
                <Reserve />
              </Nav>
            </Route>
            <Route path="/requests" exact>
              <Nav>
                <Request />
              </Nav>
            </Route>
            <Route path="/users" exact>
              <Nav>
                <UserManagement />
              </Nav>
            </Route>
            <Route path="/projectallocate" exact>
              <Nav>
                <ProjectAllocate />
              </Nav>
            </Route>
            <Route path="/developerallocate" exact>
              <Nav>
                <LeadAllocation />
              </Nav>
            </Route>
            <Route path="/projectstatus" exact>
              <Nav>
                <ProjectStatus />
              </Nav>
            </Route>
            <Route path="/reports" exact>
              <Nav>
                <Reports />
              </Nav>
            </Route>
            <Route path="/taskallocate" exact>
              <Nav>
                <TaskAllocate />
              </Nav>
            </Route>
            <Route path="/feedback" exact>
              <Nav>
                <Feedback />
              </Nav>
            </Route>
          </Switch>
        </Switch>
      </Switch>
    </Router>
  )
}
