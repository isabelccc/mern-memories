import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Typography, CircularProgress, Grid, Divider } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import Post from '../Posts/Post/Post';
import { getPostsByCreator, getPostsBySearch } from '../../actions/posts';
import { RouteParams, RootState } from '../../types';

const CreatorOrTag: React.FC = () => {
  const { name } = useParams<RouteParams>();
  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();
  const { posts, isLoading } = useSelector((state: RootState) => state.posts);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const location = useLocation();

  useEffect(() => {
    if (!name) return;

    if (location.pathname.startsWith('/tags')) {
      dispatch(getPostsBySearch({ tags: name }));
    } else {
      dispatch(getPostsByCreator(name));
    }
  }, [name, location.pathname, dispatch]);

  if (!name) {
    return (
      <Typography variant="h6" color="error">
        Invalid parameter
      </Typography>
    );
  }

  if (!posts.length && !isLoading) {
    return (
      <Typography variant="h6" color="textSecondary">
        No posts found
      </Typography>
    );
  }

  return (
    <div>
      <Typography variant="h2">{name}</Typography>
      <Divider style={{ margin: '20px 0 50px 0' }} />
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Grid container alignItems="stretch" spacing={3}>
          {posts.map((post) => (
            <Grid key={post._id} item xs={12} sm={12} md={6} lg={3}>
              <Post post={post} setCurrentId={setCurrentId} />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default CreatorOrTag;
