import React, { useState, useEffect } from 'react';
import { Box, Button, Card, Container, Grid, Typography, CircularProgress, Paper, Divider,Dialog } from '@mui/material';
import { Add as AddIcon, Person as PersonIcon, AttachMoney as MoneyIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AddDebtor from '../components/AddDebtor'; // Import AddDebtor
import { useUser } from '../context/UserContext';


// Mock data (replace with actual data fetching)
const mockStats = {
    totalDebtors: 24,
    totalDebt: 12500,
    overdue: 4,
    paidThisMonth: 3200
};

const mockRecentDebtors = [
    { id: 1, name: 'John Smith', amount: 500, date: '2023-05-15', status: 'Active' },
    { id: 2, name: 'Emma Johnson', amount: 1200, date: '2023-05-12', status: 'Overdue' },
    { id: 3, name: 'Michael Brown', amount: 350, date: '2023-05-10', status: 'Active' }
];

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [recentDebtors, setRecentDebtors] = useState([]);
    const [openAddDebtor, setOpenAddDebtor] = useState(false); // Dialog state
    const { user } = useUser();
    console.log(user);

    const navigate = useNavigate();

    useEffect(() => {
        // Simulate data loading
        setTimeout(() => {
            setStats(mockStats);
            setRecentDebtors(mockRecentDebtors);
            setLoading(false);
        }, 800);
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Dashboard
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />}
                    onClick={() => setOpenAddDebtor(true)} // Open dialog

                >
                    Add New Debtor
                </Button>
            </Box>
            {/* Add Debtor Dialog */}
            <Dialog open={openAddDebtor} onClose={() => setOpenAddDebtor(false)} maxWidth="sm" fullWidth>
                <AddDebtor />
            </Dialog>

            {/* Stats Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard 
                        title="Total Debtors" 
                        value={stats.totalDebtors} 
                        icon={<PersonIcon sx={{ fontSize: 40 }} />} 
                        color="#1976d2"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard 
                        title="Total Outstanding" 
                        value={`$${stats.totalDebt.toLocaleString()}`} 
                        icon={<MoneyIcon sx={{ fontSize: 40 }} />} 
                        color="#2e7d32"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard 
                        title="Overdue Accounts" 
                        value={stats.overdue} 
                        icon={<NotificationsIcon sx={{ fontSize: 40 }} />} 
                        color="#d32f2f"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard 
                        title="Collected This Month" 
                        value={`$${stats.paidThisMonth.toLocaleString()}`} 
                        icon={<MoneyIcon sx={{ fontSize: 40 }} />} 
                        color="#ed6c02"
                    />
                </Grid>
            </Grid>

            {/* Recent Debtors Section */}
            <Paper sx={{ p: 3, mb: 4 }} elevation={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="medium">
                        Recent Debtors
                    </Typography>
                    <Button variant="text" onClick={() => navigate('/debtors')}>
                        View All
                    </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                {recentDebtors.length > 0 ? (
                    recentDebtors.map((debtor) => (
                        <Box 
                            key={debtor.id} 
                            sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                py: 2,
                                borderBottom: '1px solid #eee',
                                '&:last-child': { borderBottom: 'none' }
                            }}
                        >
                            <Box>
                                <Typography variant="subtitle1">{debtor.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Added on {new Date(debtor.date).toLocaleDateString()}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography 
                                    variant="subtitle1" 
                                    sx={{ mr: 2, fontWeight: 'medium' }}
                                >
                                    ${debtor.amount}
                                </Typography>
                                <Box 
                                    sx={{ 
                                        bgcolor: debtor.status === 'Overdue' ? '#ffebee' : '#e8f5e9',
                                        color: debtor.status === 'Overdue' ? '#d32f2f' : '#2e7d32',
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: 1,
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {debtor.status}
                                </Box>
                            </Box>
                        </Box>
                    ))
                ) : (
                    <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
                        No recent debtors found
                    </Typography>
                )}
            </Paper>

            {/* Quick Actions */}
            <Paper sx={{ p: 3 }} elevation={2}>
                <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
                    Quick Actions
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Button 
                            variant="outlined" 
                            fullWidth 
                            onClick={() => navigate('/reports')}
                            sx={{ py: 1.5 }}
                        >
                            Generate Reports
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Button 
                            variant="outlined" 
                            fullWidth 
                            onClick={() => navigate('/payments')}
                            sx={{ py: 1.5 }}
                        >
                            Record Payment
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Button 
                            variant="outlined" 
                            fullWidth 
                            onClick={() => navigate('/reminders')}
                            sx={{ py: 1.5 }}
                        >
                            Send Reminders
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    
    );
};

// Stats Card Component
const StatsCard = ({ title, value, icon, color }) => {
    return (
        <Card sx={{ p: 2, display: 'flex', alignItems: 'center' }} elevation={2}>
            <Box 
                sx={{ 
                    mr: 2, 
                    bgcolor: `${color}15`, 
                    borderRadius: '50%', 
                    p: 1.5,
                    color: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {icon}
            </Box>
            <Box>
                <Typography variant="body2" color="text.secondary">
                    {title}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                    {value}
                </Typography>
            </Box>
        </Card>
    );
};

export default Dashboard;