import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useController } from 'react-hook-form';
import { TextField } from '@mui/material';
import dayjs from 'dayjs';

const TimePickerInput = ({ source, label }) => {
    const {
        field: { value, onChange },
        fieldState: { error }
    } = useController({ name: source });

    const handleChange = (newValue) => {
        if (newValue) {
            onChange(dayjs(newValue).format('HH:mm'));
        }
    };

    return (
        <TimePicker
            label={label}
            value={value ? dayjs(value, 'HH:mm') : null}
            onChange={handleChange}
            ampm={false}
            renderInput={(params) => (
                <TextField
                    {...params}
                    error={!!error}
                    helperText={error?.message}
                    fullWidth
                />
            )}
        />
    );
};

export default TimePickerInput;
