import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

// Shows an error message with a Retry button.
// message = the text to show, onRetry = what to do when Retry is clicked
function ErrorMessage({ message, onRetry }) {
  return (
    <Alert
      severity="error"
      sx={{ my: 2 }}
      action={
        <Button color="inherit" size="small" onClick={onRetry}>
          Retry
        </Button>
      }
    >
      {message}
    </Alert>
  );
}

export default ErrorMessage;
