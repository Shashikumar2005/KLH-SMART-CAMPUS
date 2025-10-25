import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '../utils/zodResolver';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  MenuItem,
  Grid,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { register as registerUser, clearError } from '../redux/slices/authSlice';
import { registerSchema } from '../utils/validators';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [detectedRole, setDetectedRole] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'student',
    },
  });

  const selectedRole = watch('role');
  const emailValue = watch('email');

  // Auto-detect role based on email pattern
  useEffect(() => {
    if (emailValue && emailValue.endsWith('@klh.edu.in')) {
      const emailPrefix = emailValue.split('@')[0];
      
      if (/^\d/.test(emailPrefix)) {
        // Email starts with number - Student
        setDetectedRole('student');
        setValue('role', 'student');
        
        // Auto-fill student ID if email is all numbers
        if (/^\d+$/.test(emailPrefix)) {
          setValue('studentId', emailPrefix);
        }
      } else if (/^[a-zA-Z]/.test(emailPrefix)) {
        // Email starts with letter - Faculty
        setDetectedRole('faculty');
        setValue('role', 'faculty');
        // Clear studentId for faculty
        setValue('studentId', '');
      }
    } else {
      setDetectedRole(null);
      // Reset to default
      setValue('role', 'student');
    }
  }, [emailValue, setValue]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err || 'Registration failed');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
            Smart Campus KLH
          </Typography>
          <Typography variant="h6" align="center" gutterBottom color="text.secondary">
            Create Your Account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  {...register('name')}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message || 'Use your @klh.edu.in email'}
                  placeholder="2310080030@klh.edu.in or yourname@klh.edu.in"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Role"
                  {...register('role')}
                  error={!!errors.role}
                  helperText={detectedRole ? '✓ Auto-detected from email' : errors.role?.message}
                  defaultValue="student"
                  disabled={!!detectedRole}
                  InputProps={{
                    endAdornment: detectedRole && (
                      <InputAdornment position="end">
                        <Chip 
                          label="Auto-detected" 
                          color="success" 
                          size="small" 
                          sx={{ mr: 3 }}
                        />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="faculty">Faculty</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Role"
                  {...register('role')}
                  error={!!errors.role}
                  helperText={errors.role?.message}
                  defaultValue="student"
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="faculty">Faculty</MenuItem>
                </TextField>
              </Grid>

              {selectedRole === 'student' && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Student ID"
                    {...register('studentId')}
                    error={!!errors.studentId}
                    helperText={errors.studentId?.message || 'Will be auto-filled if email is your student ID'}
                    placeholder="e.g., 2310080030"
                  />
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Department"
                  {...register('department')}
                  error={!!errors.department}
                  helperText={errors.department?.message}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  {...register('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" underline="hover">
                  Login here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
