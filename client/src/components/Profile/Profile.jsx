import React, { useEffect, useState } from 'react';
import { Container, Typography, Avatar, Button, Box, Grid, Card, CardContent } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { getPostsByCreator } from '../../actions/posts';
import { getGravatarUrl } from '../../utils/gravatar';

const Profile = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const { posts } = useSelector((state) => state.posts);

  useEffect(() => {
    // Get user info from localStorage or global state
    const profile = JSON.parse(localStorage.getItem('profile'));
    setUser(profile?.result);
    if (profile?.result?.name) {
      dispatch(getPostsByCreator(profile.result.name));
    }
  }, [dispatch]);

  if (!user) return <Typography variant="h5">Loading profile...</Typography>;

  return (
    <Container maxWidth="md" style={{ marginTop: 32 }}>
      <Box display="flex" alignItems="center" mb={4}>
        <Avatar
          src={getGravatarUrl(user.email, 80)}
          alt={user.name}
          style={{ width: 80, height: 80, marginRight: 24 }}
        />
        <Box>
          <Typography variant="h4">{user.name}</Typography>
          <Typography color="textSecondary">{user.email}</Typography>
          {/* Add more user info here if available */}
          <Button variant="outlined" color="primary" style={{ marginTop: 8 }} onClick={() => {}} disabled>
            Edit Profile (Coming Soon)
          </Button>
        </Box>
      </Box>
      <Typography variant="h5" gutterBottom>My Posts</Typography>
      <Grid container spacing={2}>
        {posts && posts.length > 0 ? posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{post.title}</Typography>
                <Typography variant="body2" color="textSecondary">{post.message}</Typography>
                <Typography variant="caption" color="textSecondary">{new Date(post.createdAt).toLocaleString()}</Typography>
              </CardContent>
            </Card>
          </Grid>
        )) : <Typography>No posts yet.</Typography>}
      </Grid>
    </Container>
  );
};

export default Profile;
