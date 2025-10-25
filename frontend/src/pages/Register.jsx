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
        background: (theme) => 
          theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          bottom: '-50%',
          left: '-50%',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          animation: 'pulse 4s ease-in-out infinite',
        },
        '@keyframes pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.1)', opacity: 0.8 },
        },
      }}
    >
      <Container maxWidth="md">
        <Paper 
          elevation={24} 
          sx={{ 
            p: 4,
            borderRadius: 4,
            background: (theme) => 
              theme.palette.mode === 'light'
                ? 'rgba(255, 255, 255, 0.95)'
                : 'rgba(30, 30, 30, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid',
            borderColor: (theme) => 
              theme.palette.mode === 'light'
                ? 'rgba(255, 255, 255, 0.3)'
                : 'rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 48px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom 
            fontWeight="bold"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Smart Campus KLH
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            gutterBottom 
            color="text.secondary"
            fontWeight={500}
            sx={{ mb: 3 }}
          >
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
                      },
                    },
                  }}
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
                      },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{
                            transition: 'transform 0.2s ease',
                            '&:hover': { transform: 'scale(1.1)' },
                          }}
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
                      },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          sx={{
                            transition: 'transform 0.2s ease',
                            '&:hover': { transform: 'scale(1.1)' },
                          }}
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
                      },
                    },
                  }}
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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
                        },
                      },
                    }}
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  {...register('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  boxShadow: '0 6px 25px rgba(102, 126, 234, 0.5)',
                  transform: 'translateY(-2px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                '&.Mui-disabled': {
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  opacity: 0.6,
                },
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link 
                  component={RouterLink} 
                  to="/login" 
                  underline="hover"
                  sx={{ 
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      textDecoration: 'underline',
                      textDecorationColor: '#667eea',
                    },
                  }}
                >
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
