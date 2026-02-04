import React from 'react';
import { CircularProgress, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';

import Post from './Post/Post';
import useStyles from './styles';
import { PostsProps, RootState, Post as PostType } from '../../types';

const Posts: React.FC<PostsProps> = ({ setCurrentId }) => {
  const { posts, isLoading } = useSelector((state: RootState) => state.posts);
  const classes = useStyles();

  if (!posts.length && !isLoading) {
    return (
      <Typography variant="h6" color="textSecondary" align="center">
        No posts found
      </Typography>
    );
  }

  return (
    isLoading ? (
      <CircularProgress />
    ) : (
      <div className={classes.masonry}>
        {posts.map((post: PostType) => (
          <div key={post._id} className={classes.masonryItem}>
            <Post post={post} setCurrentId={setCurrentId} />
          </div>
        ))}
      </div>
    )
  );
};

export default Posts;
