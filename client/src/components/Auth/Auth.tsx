import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import Icon from './icon';
import { signin, signup } from '../../actions/auth';
import * as api from '../../api';
import { AUTH } from '../../constants/actionTypes';
import useStyles from './styles';
import Input from './Input';
import { AuthFormState, GoogleLoginResponse, GoogleLoginResponseOffline } from '../../types';

const initialState: AuthFormState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const Auth: React.FC = () => {
  // ==================== State ====================
  const [form, setForm] = useState<AuthFormState>(initialState);
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();
  const history = useHistory();
  const classes = useStyles();

  // ==================== Constants ====================
  const title = isSignup ? 'Sign up' : 'Sign in';
  const submitButtonText = isSignup ? 'Sign Up' : 'Sign In';
  const switchModeText = isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign Up";
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

  // ==================== Event Handlers ====================
  const handleShowPassword = (): void => setShowPassword(!showPassword);

  const switchMode = (): void => {
    setForm(initialState);
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
    setError('');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setError('');

    if (isSignup) {
      // Trim all fields for validation
      const trimmedFirstName = form.firstName.trim();
      const trimmedLastName = form.lastName.trim();
      const trimmedEmail = form.email.trim();
      const trimmedPassword = form.password.trim();
      const trimmedConfirmPassword = form.confirmPassword.trim();

      // Validate required fields (check after trimming)
      if (!trimmedFirstName || !trimmedLastName || !trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
        setError('Please fill in all fields');
        return;
      }

      // Validate password length
      if (trimmedPassword.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      // Validate password confirmation
      if (trimmedPassword !== trimmedConfirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Use trimmed values for signup
      const trimmedForm = {
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        email: trimmedEmail,
        password: trimmedPassword,
        confirmPassword: trimmedConfirmPassword,
      };
      dispatch(signup(trimmedForm, { push: history.push }, setError));
    } else {
      // Validate sign in fields
      if (!form.email || !form.password) {
        setError('Please fill in all fields');
        return;
      }
      dispatch(signin(form, { push: history.push }, setError));
    }
  };

  const googleSuccess = async (res: GoogleLoginResponse | GoogleLoginResponseOffline): Promise<void> => {
    // Handle offline response
    if ('code' in res) {
      console.warn('Google Sign In offline response received');
      setError('Offline mode detected. Please check your internet connection.');
      return;
    }

    const { tokenId } = res;

    if (!tokenId) {
      setError('No token received from Google. Please try again.');
      return;
    }

    try {
      // Send Google token to server for validation
      const response = await api.googleSignIn(tokenId);
      const { data } = response;

      if (!data || !data.token) {
        setError('Invalid response from server. Please try again.');
        return;
      }

      // Dispatch auth action with server response
      dispatch({
        type: AUTH,
        data,
      });

      history.push('/');
    } catch (err: unknown) {
      console.error('Google sign in error:', err);
      const errObj = err as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = errObj?.response?.data?.message || errObj?.message || 'Failed to sign in with Google. Please try again.';
      setError(errorMessage);
    }
  };

  const googleError = (): void => {
    console.warn('Google Sign In was unsuccessful. Try again later');
    setError('Google Sign In failed. Please try again or use email/password.');
  };

  // ==================== Render Functions ====================
  const renderHeader = () => (
    <>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        {title}
      </Typography>
      {error && (
        <Typography variant="body2" color="error" style={{ marginTop: 10, textAlign: 'center' }}>
          {/* eslint-disable-next-line no-shadow */}
          {error}
        </Typography>
      )}
    </>
  );

  const renderFormFields = () => (
    <Grid container spacing={2}>
      {isSignup && (
        <>
          <Input
            name="firstName"
            label="First Name"
            handleChange={handleChange}
            autoFocus
            half
          />
          <Input
            name="lastName"
            label="Last Name"
            handleChange={handleChange}
            half
          />
        </>
      )}

      <Input
        name="email"
        label="Email Address"
        handleChange={handleChange}
        type="email"
      />

      <Input
        name="password"
        label="Password"
        handleChange={handleChange}
        type={showPassword ? 'text' : 'password'}
        handleShowPassword={handleShowPassword}
      />

      {isSignup && (
        <Input
          name="confirmPassword"
          label="Repeat Password"
          handleChange={handleChange}
          type="password"
        />
      )}
    </Grid>
  );

  const renderSubmitButton = () => (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      color="primary"
      className={classes.submit}
    >
      {submitButtonText}
    </Button>
  );

  const renderGoogleButton = () => {
    if (!googleClientId) {
      return (
        <Typography variant="body2" color="textSecondary" style={{ marginTop: 10, textAlign: 'center' }}>
          Google Sign-In is not configured. Please add REACT_APP_GOOGLE_CLIENT_ID to your .env file.
        </Typography>
      );
    }

    return (
      <GoogleLogin
        clientId={googleClientId}
        render={(renderProps) => (
          <Button
            className={classes.googleButton}
            color="primary"
            fullWidth
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            startIcon={<Icon />}
            variant="contained"
          >
            Google Sign In
          </Button>
        )}
        onSuccess={googleSuccess}
        onFailure={googleError}
        cookiePolicy="single_host_origin"
      />
    );
  };

  const renderSwitchMode = () => (
    <Grid container justify="flex-end">
      <Grid item>
        <Button onClick={switchMode}>
          {switchModeText}
        </Button>
      </Grid>
    </Grid>
  );

  // ==================== Main Render ====================
  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={6}>
        {renderHeader()}

        <form className={classes.form} onSubmit={handleSubmit}>
          {renderFormFields()}
          {renderSubmitButton()}
          {renderGoogleButton()}
          {renderSwitchMode()}
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;
