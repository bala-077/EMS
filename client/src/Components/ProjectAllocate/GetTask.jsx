import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
    Box, 
    Typography, 
    Card, 
    CardContent, 
    CardActions, 
    Button, 
    CircularProgress,
    Grid,
    Chip,
    Divider,
    Snackbar,
    Alert,
    Paper,
    Link
} from '@mui/material';
import { 
    CheckCircleOutline as CompletedIcon,
    PendingActions as PendingIcon,
    Update as UpdateIcon,
    Link as LinkIcon
} from '@mui/icons-material';
import moment from 'moment';

const GetTask = () => {
    const [user, setUser] = useState('');
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const getUser = () => {
        try {
            const result = sessionStorage.getItem("user");
            if (result) {
                const userData = JSON.parse(result);
                setUser(userData.username);
                return userData.username;
            }
            return '';
        } catch (error) {
            console.error("Error parsing user data:", error);
            return '';
        }
    };

    const fetchTasks = async (username) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:4000/api/allocate/developer-dashboard`, {
                params: { plname: username }
            });
            setTasks(response.data.tasks);
            setStats(response.data.stats);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setSnackbar({
                open: true,
                message: 'Failed to fetch tasks',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const username = getUser();
        if (username) {
            fetchTasks(username);
        } else {
            setLoading(false);
            setSnackbar({
                open: true,
                message: 'User information not found',
                severity: 'error'
            });
        }
        
        const interval = setInterval(() => {
            const currentUser = getUser();
            if (currentUser) {
                fetchTasks(currentUser);
            }
        }, 300000);
        
        return () => clearInterval(interval);
    }, []);

    const handleUpdateStatus = async (taskId, newStatus) => {
        try {
            await axios.patch(`http://localhost:4000/api/allocate/update-task/${taskId}`, {
                status: newStatus
            });
            
            setSnackbar({
                open: true,
                message: 'Task status updated successfully',
                severity: 'success'
            });
            
            // Refresh the task list
            const username = getUser();
            if (username) {
                fetchTasks(username);
            }
        } catch (error) {
            console.error("Error updating task:", error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Failed to update task',
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const formatDate = (date) => {
        return moment(date).format('DD MMM YYYY, hh:mm A');
    };

    // Helper function to check if a string is a URL
    const isUrl = (str) => {
        try {
            new URL(str);
            return true;
        } catch (_) {
            return false;
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Developer Task Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {moment().format('dddd, MMMM Do YYYY')}
            </Typography>
            
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6">Total Tasks</Typography>
                        <Typography variant="h3" color="primary">
                            {stats.totalTasks}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6">Completed</Typography>
                        <Typography variant="h3" color="success.main">
                            {stats.completedTasks}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6">Pending</Typography>
                        <Typography variant="h3" color="warning.main">
                            {stats.pendingTasks}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : tasks.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6">No tasks assigned for today</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Check back later or contact your team lead if you're expecting tasks.
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {tasks.map((task) => (
                        <Grid item xs={12} sm={6} md={4} key={task._id}>
                            <Card 
                                elevation={3}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderLeft: task.status === 'Completed' ? 
                                        '4px solid #4caf50' : '4px solid #ff9800'
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        mb: 1
                                    }}>
                                        <Chip 
                                            label={task.type}
                                            color="primary"
                                            size="small"
                                        />
                                        <Chip 
                                            label={task.status}
                                            icon={task.status === 'Completed' ? 
                                                <CompletedIcon fontSize="small" /> : 
                                                <PendingIcon fontSize="small" />}
                                            color={task.status === 'Completed' ? 
                                                'success' : 'warning'}
                                            variant="outlined"
                                        />
                                    </Box>
                                    
                                    <Typography variant="h6" sx={{ mt: 1 }}>
                                        {task.plname}
                                    </Typography>
                                    
                                    <Box sx={{ mt: 1 }}>
                                        {isUrl(task.desc) ? (
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<LinkIcon />}
                                                href={task.desc}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{ 
                                                    mt: 1,
                                                    textTransform: 'none'
                                                }}
                                            >
                                                Open Test Link
                                            </Button>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                {task.desc}
                                            </Typography>
                                        )}
                                    </Box>
                                    
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="caption" display="block" color="text.secondary">
                                            Assigned by: {task.allocatedBy}
                                        </Typography>
                                        <Typography variant="caption" display="block" color="text.secondary">
                                            Created: {formatDate(task.createdAt)}
                                        </Typography>
                                        {task.completedAt && (
                                            <Typography variant="caption" display="block" color="text.secondary">
                                                Completed: {formatDate(task.completedAt)}
                                            </Typography>
                                        )}
                                    </Box>
                                </CardContent>
                                
                                <CardActions sx={{ justifyContent: 'flex-end' }}>
                                    {task.status === 'Pending' ? (
                                        <Button
                                            size="small"
                                            color="success"
                                            startIcon={<CompletedIcon />}
                                            onClick={() => handleUpdateStatus(task._id, 'Completed')}
                                        >
                                            Mark Complete
                                        </Button>
                                    ) : (
                                        <Button
                                            size="small"
                                            color="warning"
                                            startIcon={<UpdateIcon />}
                                            onClick={() => handleUpdateStatus(task._id, 'Pending')}
                                        >
                                            Reopen Task
                                        </Button>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
            
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default GetTask;