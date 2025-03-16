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
import PeopleIcon from '@material-ui/icons/People'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'
import AssignmentReturnIcon from '@material-ui/icons/AssignmentReturn'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import Brightness5Icon from '@material-ui/icons/Brightness5'
import EventIcon from '@material-ui/icons/Event'
import { formatDate } from '../../Tools/Tools'

export const adminDashboard = ({
  counts,
  recentAddedStudents,
  recentAddedBooks,
  
}) => (
  <div>
    <CssBaseline />
    <Container>
      {/* cards */}
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
            {/* start row */}
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
            <Grid item md={4}>
              <Paper className={styles.Items}>
                <div className={styles.BookSideColor}></div>
                <div className={styles.Icons}>
                  <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    style={{ height: '100%' }}
                  >
                    <Grid item xs={12}>
                      <LibraryBooksIcon className={styles.iconStyle} />
                    </Grid>
                  </Grid>
                </div>
                <div className={styles.Content}>
                  <Typography variant={'h5'} className={styles.ContentTitle}>
                    Projects
                  </Typography>
                  <Divider />
                  <Typography variant={'h5'} className={styles.ContentValue}>
                    {counts.totalBooks}
                  </Typography>
                </div>
              </Paper>
            </Grid>

            <Grid item md={4}>
              <Paper className={styles.Items}>
                <div className={styles.StudentSideColor}></div>
                <div className={styles.Icons}>
                  <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    style={{ height: '100%' }}
                  >
                    <Grid item xs={12}>
                      <PeopleIcon className={styles.iconStyle} />
                    </Grid>
                  </Grid>
                </div>
                <div className={styles.Content}>
                  <Typography variant={'h5'} className={styles.ContentTitle}>
                    Employees
                  </Typography>
                  <Divider />
                  <Typography variant={'h5'} className={styles.ContentValue}>
                    {counts.totalStudents}
                  </Typography>
                </div>
              </Paper>
            </Grid>
            {/* end row */}
          </Grid>
        </Grid>
        {/* 2nd row grid */}
        <Grid
          container
          spacing={0}
          direction="row"
          justify="flex-start"
          alignItems="stretch"
          className={styles.cardsContainer}
        >
          <Grid container spacing={3} justify="center" alignItems="stretch">
            {/* start row */}
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
                    Allocated projects
                  </Typography>
                  <Divider />
                  <Typography variant={'h5'} className={styles.ContentValue}>
                    {counts.totalBorrowedBooks}
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
                    Completed Projects
                  </Typography>
                  <Divider />
                  <Typography variant={'h5'} className={styles.ContentValue}>
                    {counts.totalReservedBooks}
                  </Typography>
                </div>
              </Paper>
            </Grid>
            <Grid item md={4}>
              <Paper className={styles.Items}>
                <div className={styles.WaitingSideColor}></div>
                <div className={styles.Icons}>
                  <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    style={{ height: '100%' }}
                  >
                    <Grid item xs={12}>
                      <AccessTimeIcon className={styles.iconStyle} />
                    </Grid>
                  </Grid>
                </div>
                <div className={styles.Content}>
                  <Typography variant={'h5'} className={styles.ContentTitle}>
                    Pending Projects 
                  </Typography>
                  <Divider />
                  <Typography variant={'h5'} className={styles.ContentValue}>
                    {counts.totalPendingReservations}
                  </Typography>
                </div>
              </Paper>
            </Grid>
            {/* end row */}
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
                    <TableCell>ProjectName</TableCell>
                    <TableCell>Coding Language</TableCell>
                    <TableCell>DatabaseName</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentAddedBooks &&
                    recentAddedBooks.map((project) => {
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
                    <TableCell>Username</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentAddedStudents &&
                    recentAddedStudents.map((student) => {
                      return (
                        <TableRow key={student.id}>
                          <TableCell>
                            {formatDate(student.dateCreated)}
                          </TableCell>
                          <TableCell>{student.name}</TableCell> 
                          <TableCell>{student.username}</TableCell>
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
