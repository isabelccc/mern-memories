import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 1000,
  },
}));

export default useStyles;
