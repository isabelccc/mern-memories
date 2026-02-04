import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import FileBase from 'react-file-base64';
import { useHistory } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { createPost, updatePost } from '../../actions/posts';
import useStyles from './styles';
import { RootState, Post, FormProps, PostFormState, Profile } from '../../types';

const Form: React.FC<FormProps> = ({ currentId, setCurrentId }) => {
  const classes = useStyles();
  const history = useHistory();

  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();

  const [postData, setPostData] = useState<PostFormState>({
    title: '',
    message: '',
    tags: [],
    selectedFile: '',
  });

  const post = useSelector((state: RootState) =>
    (currentId ? state.posts.posts.find((p: Post) => p._id === currentId) : null),
  );

  const rawProfile = localStorage.getItem('profile');
  const user: Profile | null = rawProfile ? JSON.parse(rawProfile) : null;

  const clear = () => {
    setCurrentId(null);
    setPostData({ title: '', message: '', tags: [], selectedFile: '' });
  };

  useEffect(() => {
    if (!post?.title) clear();
    if (post) {
      setPostData({
        title: post.title,
        message: post.message,
        tags: post.tags ?? [],
        selectedFile: post.selectedFile ?? '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const name = user?.result?.name;

    if (!name) return;

    if (!currentId) {
      dispatch(createPost({ ...postData, name }, { push: history.push }));
      clear();
    } else {
      dispatch(updatePost(currentId, { ...postData, name }));
      clear();
    }
  };

  if (!user?.result?.name) {
    return (
      <Paper className={classes.paper} elevation={6}>
        <Typography variant="h6" align="center">
          Please Sign In to create your own memories and like other&apos;s memories.
        </Typography>
      </Paper>
    );
  }

  const handleAddChip = (tag: string) => {
    setPostData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
  };

  const handleDeleteChip = (chipToDelete: string) => {
    setPostData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== chipToDelete),
    }));
  };

  return (
    <Paper className={classes.paper} elevation={6}>
      <form
        autoComplete="off"
        noValidate
        className={`${classes.root} ${classes.form}`}
        onSubmit={handleSubmit}
      >
        <Typography variant="h6">
          {currentId ? `Editing "${post?.title}"` : 'Creating a Memory'}
        </Typography>

        <TextField
          name="title"
          variant="outlined"
          label="Title"
          fullWidth
          value={postData.title}
          onChange={(e) => setPostData((prev) => ({ ...prev, title: e.target.value }))}
        />

        <TextField
          name="message"
          variant="outlined"
          label="Message"
          fullWidth
          multiline
          rows={4}
          value={postData.message}
          onChange={(e) => setPostData((prev) => ({ ...prev, message: e.target.value }))}
        />

        <div style={{ padding: '5px 0', width: '94%' }}>
          <ChipInput
            variant="outlined"
            label="Tags"
            fullWidth
            value={postData.tags}
            onAdd={(chip) => handleAddChip(chip as string)}
            onDelete={(chip) => handleDeleteChip(chip as string)}
          />
        </div>

        <div className={classes.fileInput}>
          <FileBase
            type="file"
            multiple={false}
            onDone={({ base64 }: { base64: string }) =>
              setPostData((prev) => ({ ...prev, selectedFile: base64 }))}
          />
        </div>

        <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>
          Submit
        </Button>

        <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>
          Clear
        </Button>
      </form>
    </Paper>
  );
};

export default Form;
