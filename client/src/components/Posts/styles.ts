import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  masonry: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gridGap: theme.spacing(1.5),
    gridAutoRows: '10px',
    padding: theme.spacing(1.5),
    [theme.breakpoints.up('lg')]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    },
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gridGap: theme.spacing(1),
      padding: theme.spacing(1),
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    },
  },
  masonryItem: {
    breakInside: 'avoid',
    marginBottom: theme.spacing(2),
  },
}));
