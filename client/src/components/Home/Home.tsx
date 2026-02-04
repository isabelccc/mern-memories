import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import { Container, Grow, Grid, AppBar, TextField, Button, Paper } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { getPostsBySearch } from '../../actions/posts';
import Posts from '../Posts/Posts';
import Form from '../Form/Form';
import Pagination from '../Pagination';
import useStyles from './styles';

function useQuery(): URLSearchParams {
  return new URLSearchParams(useLocation().search);
}

const Home: React.FC = () => {
  const classes = useStyles();
  const query = useQuery();
  const page = Number(query.get('page')) || 1;
  const searchQuery = query.get('searchQuery');

  const [currentId, setCurrentId] = useState<string | null>(null);
  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();

  const [search, setSearch] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const history = useHistory();

  const searchPost = (): void => {
    if (search.trim() || tags.length > 0) {
      dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
      history.push(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
    } else {
      history.push('/');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      searchPost();
    }
  };

  const handleAddChip = (tag: string): void => {
    setTags([...tags, tag]);
  };

  const handleDeleteChip = (chipToDelete: string): void => {
    setTags(tags.filter((tag) => tag !== chipToDelete));
  };

  return (
    <Grow in>
      <Container maxWidth={false} style={{ padding: 0 }}>
        <Grid container spacing={3} className={classes.gridContainer}>
          {/* Search and Form Sidebar - Fixed width on larger screens */}
          <Grid item xs={12} sm={12} md={3} lg={2}>
            <div style={{ position: 'sticky', top: 20 }}>
              <AppBar className={classes.appBarSearch} position="static" color="inherit">
                <TextField
                  onKeyDown={handleKeyPress}
                  name="search"
                  variant="outlined"
                  label="Search Memories"
                  fullWidth
                  value={search}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                  style={{ marginBottom: 10 }}
                />
                <ChipInput
                  style={{ margin: '10px 0' }}
                  value={tags}
                  onAdd={(chip) => handleAddChip(chip as string)}
                  onDelete={(chip) => handleDeleteChip(chip as string)}
                  label="Search Tags"
                  variant="outlined"
                />
                <Button onClick={searchPost} variant="contained" color="primary" fullWidth style={{ marginTop: 10 }}>
                  Search
                </Button>
              </AppBar>
              <Form currentId={currentId} setCurrentId={setCurrentId} />
              {(!searchQuery && !tags.length) && (
                <Paper className={classes.pagination} elevation={6} style={{ marginTop: 16 }}>
                  <Pagination page={page} />
                </Paper>
              )}
            </div>
          </Grid>
          {/* Posts Grid - Takes remaining space */}
          <Grid item xs={12} sm={12} md={9} lg={10}>
            <Posts setCurrentId={setCurrentId} />
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;
