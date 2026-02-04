import React, { useState, useEffect, MouseEvent } from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase } from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { likePost, deletePost } from '../../../actions/posts';
import useStyles from './styles';
import { PostProps, Profile } from '../../../types';

const Post: React.FC<PostProps> = ({ post, setCurrentId }) => {
  const rawProfile = localStorage.getItem('profile');
  const user: Profile | null = rawProfile ? JSON.parse(rawProfile) : null;
  const [likes, setLikes] = useState<string[]>(post?.likes || []);
  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();
  const history = useHistory();
  const classes = useStyles();

  // Always use _id (database ID) since backend stores database IDs in likes array
  const userId = user?.result?._id;

  // Sync local likes state with post prop from Redux
  useEffect(() => {
    setLikes(post?.likes || []);
  }, [post?.likes]);

  const handleLike = async (): Promise<void> => {
    if (!userId) {
      return;
    }

    // Check if user has already liked based on current likes state
    const hasLikedPost = likes.find((like: string) => like === userId);
    const previousLikes = [...likes]; // Store previous state for rollback

    // Optimistic update
    if (hasLikedPost) {
      setLikes(likes.filter((id: string) => id !== userId));
    } else {
      setLikes([...likes, userId]);
    }

    try {
      // Dispatch action to update server and Redux
      await dispatch(likePost(post._id));
    } catch (error) {
      // Revert optimistic update on error
      console.error('Like post error:', error);
      setLikes(previousLikes);
    }
  };

  const Likes: React.FC = () => {
    if (likes.length > 0) {
      return likes.find((like: string) => like === userId)
        ? (
          <>
            <ThumbUpAltIcon fontSize="small" />&nbsp;
            {likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}`}
          </>
        ) : (
          <>
            <ThumbUpAltOutlined fontSize="small" />&nbsp;
            {likes.length} {likes.length === 1 ? 'Like' : 'Likes'}
          </>
        );
    }

    return (
      <>
        <ThumbUpAltOutlined fontSize="small" />&nbsp;Like
      </>
    );
  };

  const openPost = (): void => {
    history.push(`/posts/${post._id}`);
  };

  const handleEditClick = (e: MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    setCurrentId(post._id);
  };

  const handleDeleteClick = (): void => {
    dispatch(deletePost(post._id));
  };

  return (
    <Card className={classes.card} raised elevation={6}>
      <ButtonBase
        component="span"
        className={classes.cardAction}
        onClick={openPost}
      >
        <CardMedia
          className={classes.media}
          image={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'}
          title={post.title}
        />
        <div className={classes.overlay}>
          <Typography variant="h6">{post.name}</Typography>
          <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
        </div>
        {user?.result?._id === post?.creator && (
          <div className={classes.overlay2}>
            <Button
              onClick={handleEditClick}
              style={{ color: 'white' }}
              size="small"
            >
              <MoreHorizIcon fontSize="default" />
            </Button>
          </div>
        )}
        <div className={classes.details}>
          <Typography variant="body2" color="textSecondary" component="h2">
            {post.tags.map((tag: string) => `#${tag} `)}
          </Typography>
        </div>
        <Typography className={classes.title} gutterBottom variant="h6" component="h2">
          {post.title}
        </Typography>
        {post.message && (
          <CardContent style={{ paddingTop: 0, paddingBottom: 8 }}>
            <Typography className={classes.messagePreview} variant="body2" color="textSecondary" component="p">
              {post.message}
            </Typography>
          </CardContent>
        )}
      </ButtonBase>
      <CardActions className={classes.cardActions}>
        <Button
          size="small"
          color="primary"
          disabled={!user?.result}
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            handleLike();
          }}
        >
          <Likes />
        </Button>
        {user?.result?._id === post?.creator && (
          <Button
            size="small"
            color="secondary"
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              handleDeleteClick();
            }}
          >
            <DeleteIcon fontSize="small" /> &nbsp; Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default Post;
