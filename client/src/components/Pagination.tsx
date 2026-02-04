/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pagination, PaginationItem } from '@material-ui/lab';
import { Link } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import { getPosts } from '../actions/posts';
import useStyles from './styles';
import { RootState, PaginationProps } from '../types';

const Paginate: React.FC<PaginationProps> = ({ page }) => {
  const { numberOfPages } = useSelector((state: RootState) => state.posts);
  const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();

  const classes = useStyles();

  useEffect(() => {
    if (page) {
      dispatch(getPosts(page));
    }
  }, [dispatch, page]);

  return (
    <Pagination
      classes={{ ul: classes.ul }}
      count={numberOfPages}
      page={Number(page) || 1}
      variant="outlined"
      color="primary"
      renderItem={(item) => (
        <PaginationItem {...item} component={Link} to={`/posts?page=${item.page}`} />
      )}
    />
  );
};

export default Paginate;
