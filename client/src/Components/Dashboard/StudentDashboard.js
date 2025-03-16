import {
  Container,
  CssBaseline,
  Divider,
  Grid,
  Paper,
  TableCell,
  TableContainer,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableBody,
} from '@material-ui/core'

import styles from './Dashboard.module.css'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import Brightness5Icon from '@material-ui/icons/Brightness5'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import EventIcon from '@material-ui/icons/Event'
import AssignmentReturnIcon from '@material-ui/icons/AssignmentReturn'
import { formatDate } from '../../Tools/Tools'

export const studentDashboard = ({
  counts,
  PMrecentAddedStudents,
  PMrecentAddedBooks,
}) => (
  <div>
    <CssBaseline />
    <Container>
      <Grid style={{ height: '100%', paddingBottom: '10%' }}>
        <Grid
          container
          spacing={0}
          direction="row"
          justify="flex-start"
          alignItems="stretch"
          className={styles.cardsContainer}
        >
          <Grid container spacing={3} justify="center" alignItems="stretch">
            <Grid item md={4}>
              <Paper className={styles.Items}>
                <div className={styles.TodaySideColor}></div>
                <div className={styles.Icons}>
                  <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    style={{ height: '100%' }}
                  >
                    <Grid item xs={12}>
                      <Brightness5Icon className={styles.iconStyle} />
                    </Grid>
                  </Grid>
                </div>
                <div className={styles.Content}>
                  <Typography variant={'h5'} className={styles.ContentTitle}>
                    Date Today
                  </Typography>
                  <Divider />
                  <Typography variant={'h5'} className={styles.ContentValue}>
                    {new Date().toDateString()}
                  </Typography>
                </div>
              </Paper>
            </Grid>
            {/* next */}
  
            <Grid item md={4}>
              <Paper className={styles.Items}>
                <div className={styles.BorrowSideColor}></div>
                <div className={styles.Icons}>
                  <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    style={{ height: '100%' }}
                  >
                    <Grid item xs={12}>
                      <AssignmentReturnIcon className={styles.iconStyle} />
                    </Grid>
                  </Grid>
                </div>
                <div className={styles.Content}>
                  <Typography variant={'h5'} className={styles.ContentTitle}>
                    Total Projects
                  </Typography>
                  <Divider />
                  <Typography variant={'h5'} className={styles.ContentValue}>
                { counts.PMtotalBooks } 
                  </Typography>
                </div>
              </Paper>
            </Grid>
            <Grid item md={4}>
              <Paper className={styles.Items}>
                <div className={styles.ReserveSideColor}></div>
                <div className={styles.Icons}>
                  <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    style={{ height: '100%' }}
                  >
                    <Grid item xs={12}>
                      <EventIcon className={styles.iconStyle} />
                    </Grid>
                  </Grid>
                </div>
                <div className={styles.Content}>
                  <Typography variant={'h5'} className={styles.ContentTitle}>
                    Total Employees
                  </Typography>
                  <Divider />
                  <Typography variant={'h5'} className={styles.ContentValue}>
                    { counts.PMtotalStudents } 
                  </Typography>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* 2 tables */}
        <Grid
          style={{ marginTop: '35px' }}
          justify="center"
          alignItems="stretch"
          container
          spacing={3}
        >
          <Grid item md={6}>
            <Typography
              style={{ opacity: 0.5, marginBottom: '10px' }}
              variant="h5"
            >
              Recently Added Projects
            </Typography>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                  <TableCell>Date Added</TableCell>
                    <TableCell>Project Name</TableCell>
                    <TableCell>Coding Language</TableCell>
                    <TableCell>Database Name</TableCell>
                  </TableRow>
                  
                </TableHead>
                
                <TableBody>
                  {PMrecentAddedBooks &&
                    PMrecentAddedBooks.map((project) => {
                      return (
                        <TableRow key={project.id}>
                          <TableCell>{formatDate(project.registerdate)}</TableCell>
                          <TableCell>{project.projectname}</TableCell>
                          <TableCell>{project.codinglanguage}</TableCell>
                          <TableCell>{project.databasename}</TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
                  
                
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={6}>
            <Typography
              style={{ opacity: 0.5, marginBottom: '10px' }}
              variant="h5"
            >
              Recently Added Employees
            </Typography>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    
                    <TableCell>Date Added</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>User Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {PMrecentAddedStudents &&
                    PMrecentAddedStudents.map((student) => {
                      return (
                        <TableRow key={student.id}>
                          <TableCell>
                            {formatDate(student.dateCreated)}
                          </TableCell>
                          <TableCell>
                            {student.name}
                          </TableCell>
                          <TableCell>
                            {student.username}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  </div>
)
