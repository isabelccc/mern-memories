import React, { useState, useRef, useEffect } from 'react';
import { Typography, TextField, Button } from '@material-ui/core/';
import { useDispatch } from 'react-redux';

import { commentPost } from '../../actions/posts';
import useStyles from './styles';

const CommentSection = ({ post }) => {
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
  const [comments, setComments] = useState(post?.comments || []);
  const classes = useStyles();
  const commentsRef = useRef();

  // Sync comments with post prop updates
  useEffect(() => {
    setComments(post?.comments || []);
  }, [post?.comments]);

  const handleComment = async () => {
    if (!comment.trim()) return;

    const newComments = await dispatch(commentPost(comment.trim(), post._id));

    setComment('');
    if (newComments) {
      setComments(newComments);
      setTimeout(() => {
        commentsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div>
      <div className={classes.commentsOuterContainer}>
        <div className={classes.commentsInnerContainer}>
          <Typography gutterBottom variant="h6">Comments</Typography>
          {comments && comments.length > 0 ? (
            comments.map((c) => (
              <Typography key={c._id || c.id} gutterBottom variant="subtitle1">
                <strong>{c.authorName || 'Unknown'}:</strong> {c.text}
              </Typography>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">No comments yet.</Typography>
          )}
          <div ref={commentsRef} />
        </div>
        <div style={{ width: '70%' }}>
          <Typography gutterBottom variant="h6">Write a comment</Typography>
          <TextField fullWidth rows={4} variant="outlined" label="Comment" multiline value={comment} onChange={(e) => setComment(e.target.value)} />
          <br />
          <Button style={{ marginTop: '10px' }} fullWidth disabled={!comment.trim().length} color="primary" variant="contained" onClick={handleComment}>
            Comment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
