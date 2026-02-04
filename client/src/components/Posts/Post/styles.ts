import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  media: {
    height: 0,
    paddingTop: '100%', // Square aspect ratio - more compact
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    backgroundBlendMode: 'darken',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
  border: {
    border: 'solid',
  },
  fullHeightCard: {
    height: '100%',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '12px',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    transition: 'box-shadow 0.3s ease, transform 0.2s ease',
    '&:hover': {
      boxShadow: '0 8px 16px rgba(0,0,0,0.15), 0 4px 4px rgba(0,0,0,0.12)',
      transform: 'translateY(-2px)',
    },
  },
  overlay: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    color: 'white',
    textShadow: '0 1px 3px rgba(0,0,0,0.5)',
    zIndex: 1,
    '& h6': {
      fontWeight: 600,
      fontSize: '0.75rem',
    },
    '& p': {
      fontSize: '0.7rem',
      marginTop: '2px',
    },
  },
  overlay2: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    color: 'white',
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '50%',
    minWidth: '32px',
    height: '32px',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
  },
  grid: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    justifyContent: 'flex-start',
    margin: '8px 12px 4px 12px',
    flexWrap: 'wrap',
    gap: '3px',
    '& h2': {
      fontSize: '0.7rem',
      color: theme.palette.text.secondary,
      fontWeight: 500,
    },
  },
  title: {
    padding: '0 12px 6px 12px',
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1.2,
    color: theme.palette.text.primary,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  cardActions: {
    padding: '6px 12px 8px 12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(0,0,0,0.05)',
    minHeight: '40px',
    '& button': {
      fontSize: '0.75rem',
      padding: '4px 8px',
    },
  },
  cardAction: {
    display: 'block',
    textAlign: 'initial',
    width: '100%',
  },
  messagePreview: {
    padding: '0 12px 6px 12px',
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    lineHeight: 1.3,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
}));
