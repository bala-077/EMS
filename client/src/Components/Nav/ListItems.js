import React from 'react'
import { NavLink } from 'react-router-dom'
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import {
  Assignment as AssignmentIcon,
  AssignmentReturn as AssignmentReturnIcon,
  Dashboard as DashboardIcon,
  Event as EventIcon,
  LibraryAdd as LibraryAddIcon,
  People as PeopleIcon,
 
  Search as SearchIcon,
} from '@material-ui/icons'
import ReportIcon from '@material-ui/icons/Report';
//import GitHubIcon from '@material-ui/icons/GitHub'

export const adminListItems = (
  <div>
    <ListItem
      button
      component={NavLink}
      to="/dashboard"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>


  
    <ListItem
      button
      component={NavLink}
      to="/books"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <LibraryAddIcon />
      </ListItemIcon>
      <ListItemText primary="Project Management" />
    </ListItem>

    <ListItem
      button
      component={NavLink}
      to="/users"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="User Management" />
    </ListItem>

    <ListItem
      button
      component={NavLink}
      to="/reports"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <ReportIcon />
      </ListItemIcon>
      <ListItemText primary="Project Report" />
    </ListItem>
    <ListItem
      button
      component={NavLink}
      to="/projectstatus"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <ReportIcon />
      </ListItemIcon>
      <ListItemText primary="Project Status" />
    </ListItem>

  </div>
)

export const studentListItems = (
  <div>
    <ListItem
      button
      component={NavLink}
      to="/dashboard"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
   
  <ListItem
      button
      component={NavLink}
      to="/projectallocate"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <EventIcon />
      </ListItemIcon>
      <ListItemText primary="Project Allocation" />
    </ListItem>
  <ListItem
      button
      component={NavLink}
      to="/projectstatus"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <EventIcon />
      </ListItemIcon>
      <ListItemText primary="Project Status" />
    </ListItem>

  
  </div>
)


// project lead
export const PLListItems = (
  <div>
    <ListItem
      button
      component={NavLink}
      to="/dashboard"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>

   
  
    <ListItem
      button
      component={NavLink}
      to="/developerallocate"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <EventIcon />
      </ListItemIcon>
      <ListItemText primary="Project Allocation" />
    </ListItem>

    <ListItem
      button
      component={NavLink}
      to="/projectstatus"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <EventIcon />
      </ListItemIcon>
      <ListItemText primary="Project Status" />
    </ListItem>

    <ListItem
      button
      component={NavLink}
      to="/taskallocate"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <EventIcon />
      </ListItemIcon>
      <ListItemText primary="Task Allocation" />
    </ListItem>

    <ListItem
      button
      component={NavLink}
      to="/feedback"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <EventIcon />
      </ListItemIcon>
      <ListItemText primary="FeedBack" />
    </ListItem>
  
  </div>
)

// project developer
export const PDListItems = (
  <div>
    <ListItem
      button
      component={NavLink}
      to="/dashboard"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>

   
  
    <ListItem
      button
      component={NavLink}
      to="/projectallocated"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <EventIcon />
      </ListItemIcon>
      <ListItemText primary="Project Allocated" />
    </ListItem>


    <ListItem
      button
      component={NavLink}
      to="/gettodaytask"
      exact
      activeStyle={{
        backgroundColor: '#ecf0f1',
      }}
    >
      <ListItemIcon>
        <EventIcon />
      </ListItemIcon>
      <ListItemText primary="Get Today Task" />
    </ListItem>

    
  
  </div>
)

export const secondaryListItems = (
  <div>
    
  </div>
)
