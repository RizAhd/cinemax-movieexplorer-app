import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

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
