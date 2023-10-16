import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface SnackbarProps {
    handleSnackClose: () => void;
    isError: boolean;
}

const Snackbars: React.FC<SnackbarProps> = ({
    isError, handleSnackClose
}) => {

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        handleSnackClose()
    };

    return (
        <Snackbar open={isError} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
                Unfortunately, an error occurred when generating data!
            </Alert>
        </Snackbar>
    );
}

export default Snackbars;