import React, { useState, useEffect } from 'react';
import { AppBar, Typography, Toolbar, Button, Box } from '@material-ui/core';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

import memoriesLogo from '../../images/memoriesLogo.png';
import memoriesText from '../../images/memoriesText.png';
import * as actionType from '../../constants/actionTypes';
import useStyles from './styles';
import { getGravatarUrl } from '../../utils/gravatar';

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();

  const logout = () => {
    dispatch({ type: actionType.LOGOUT });

    history.push('/auth');

    setUser(null);
  };

  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = jwtDecode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem('profile')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <AppBar className={classes.appBar} position="static" color="inherit">
      <Link to="/" className={classes.brandContainer}>
        <img src={memoriesText} alt="icon" height="45px" />
        <img className={classes.image} src={memoriesLogo} alt="icon" height="40px" />
      </Link>
      <Toolbar className={classes.toolbar}>
        {user?.result ? (
          <Box display="flex" alignItems="center">
            <Link to={`/profile/${user.result._id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
              <img
                src={getGravatarUrl(user.result.email, 40)}
                alt={user.result.name}
                style={{ borderRadius: '50%', width: 40, height: 40, marginRight: 8 }}
              />
              <Typography variant="h6">{user.result.name}</Typography>
            </Link>
            <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>Logout</Button>
          </Box>
        ) : (
          <Button component={Link} to="/auth" variant="contained" color="primary">Sign In</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
