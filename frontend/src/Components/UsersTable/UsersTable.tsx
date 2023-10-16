import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import {
    CountryType,
    ERR_RATE_DECIMAL_PLACES,
    MAX_RANDOM_SEED, countries,
    MAX_ERR_RATE, MAX_SEED_VALUE,
    sanitizeValue
} from '../../utills/constants'
import { api } from '../../utills/api';
import Button from '@mui/material/Button/Button';
import exportFromJSON from 'export-from-json'
import Snackbars from '../Snackbars/Snackbars';
import './UsersTable.css'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        maxWidth: '100px',

    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        maxWidth: '100px',
        overflow: 'hidden',
        whiteSpace: "wrap",
        textOverflow: "ellipsis",
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


const UsersTable = () => {

    const [isLoading, setIsloading] = React.useState(false);
    const [region, setRegion] = React.useState('Russia');
    const [seed, setSeed] = React.useState(0)
    const [seedInputValue, setSeedInputValue] = React.useState('');
    const [page, setPage] = React.useState(1)
    const [errRate, setErrRate] = React.useState(0)
    const [errRateInputValue, setErrRateInputValue] = React.useState('');
    const [sliderValue, setSliderValue] = React.useState(errRate);
    const [isError, setIsError] = React.useState(false);
    const [users, setUsers] = React.useState([
        {
            address: '',
            cell: '',
            fullName: '',
            id: '',
            num: '',
        }
    ]);

    const observer = React.useRef<IntersectionObserver | null>(null);

    const lastCellRef = React.useCallback((node: Element | null) => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPage(prevPage => prevPage + 1)
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading]);

    const handleChangeRegion = (event: React.SyntheticEvent, value: CountryType | null) => {
        if (value && value.label) {
            setRegion(value.label);
        } else {
            setRegion('Russia');
        }
    }

    const handleChangeErrRate = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;

        if (Number(value) > Number(MAX_ERR_RATE)) {
            value = MAX_ERR_RATE
        }

        const sanitizedAndOneDotValue = sanitizeValue(value, true).replace(/\.+/g, '.')

        const decimalParts = sanitizedAndOneDotValue.split('.');
        if (decimalParts[1] && decimalParts[1].length > ERR_RATE_DECIMAL_PLACES) {
            return;
        }

        setErrRateInputValue(sanitizedAndOneDotValue.toString());
        setSliderValue(Number(sanitizedAndOneDotValue))
        setErrRate(Number(sanitizedAndOneDotValue));
    }

    const handleSeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;

        if (Number(value) > Number(MAX_SEED_VALUE)) {
            value = MAX_SEED_VALUE
        }

        const outputValue = sanitizeValue(value, false)

        setSeedInputValue(outputValue);
        setSeed(Number(outputValue));
    };

    const handleScroll = (event: Event, value: number | number[]) => {
        const stringValue = String(value);

        const fakeEvent = {
            target: {
                value: stringValue,
            },
        } as React.ChangeEvent<HTMLInputElement>;

        handleChangeErrRate(fakeEvent);
    }

    React.useEffect(() => {
        if (isError) {
            return;
        }
        setIsloading(true)
        api.getFakeData(region, seed, page, errRate)
            .then((data) => {
                setUsers(data)
            })
            .catch(() => setIsError(true))
            .finally(() => setIsloading(false))
    }, [region, seed, page, errRate])

    const handleRandomSeedClick = () => {
        const randomNumber = Math.floor(Math.random() * MAX_RANDOM_SEED) + 1;
        setSeed(randomNumber);
        setSeedInputValue(randomNumber.toString());
    }

    const handleDownloadData = () => {
        const data = users;
        const fileName = 'users';
        const withBOM = true
        const exportType = exportFromJSON.types.csv
        exportFromJSON({ data, fileName, exportType, withBOM })
    }

    const handleSnackClose = () => {
        setIsError(false)
    }

    return (
        <div>
            <Snackbars handleSnackClose={handleSnackClose} isError={isError} />
            <div className='users-table__container'>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: '50px', width: '100%', mb: '10px'
                }}>
                    <Autocomplete
                        sx={{ minWidth: '150px' }}
                        onChange={handleChangeRegion}
                        id="country-select-demo"
                        options={countries}
                        autoSelect
                        autoHighlight
                        defaultValue={countries[0]}
                        getOptionLabel={(option) => option.label}
                        renderOption={(props, option) => (
                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                <img
                                    loading="lazy"
                                    width="20"
                                    srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                    src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                    alt=""
                                />
                                {option.label}
                            </Box>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Choose region"
                                inputProps={{
                                    ...params.inputProps,
                                    autoComplete: 'new-password',
                                }}
                                size='small'
                            />
                        )}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                        <TextField value={seedInputValue}
                            onChange={handleSeedChange}
                            sx={{ maxWidth: 100 }} label="Seed" size='small'
                        />
                        <Button onClick={handleRandomSeedClick}
                            sx={{ height: "40px" }} variant="outlined" endIcon={<ShuffleIcon />}>Random</Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: '15px', alignItems: 'center' }}>
                        <TextField value={errRateInputValue}
                            onChange={handleChangeErrRate}
                            sx={{ maxWidth: 100 }} label="Errors" size='small' inputProps={{ type: "text" }}
                        />
                        <Slider
                            defaultValue={errRate}
                            onChange={handleScroll}
                            size="small"
                            min={0}
                            max={10}
                            step={0.25}
                            sx={{ minWidth: '100px' }}
                            value={sliderValue}
                        />
                    </Box>
                    <Button onClick={handleDownloadData} variant="outlined">Export</Button>
                </Box>
                <TableContainer sx={{ widows: "100%" }} component={Paper}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead >
                            <TableRow>
                                <StyledTableCell>№</StyledTableCell>
                                <StyledTableCell align="left">Name</StyledTableCell>
                                <StyledTableCell align="left">Id</StyledTableCell>
                                <StyledTableCell align="left">Adress</StyledTableCell>
                                <StyledTableCell align="left">Phone</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((row, index) => {
                                const isLastCell = users.length === index + 1;
                                return (
                                    <StyledTableRow key={row.num} ref={isLastCell ? lastCellRef : null}>
                                        <StyledTableCell component="th" scope="row">
                                            {row.num}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">{row.fullName}</StyledTableCell>
                                        <StyledTableCell align="left">{row.id}</StyledTableCell>
                                        <StyledTableCell align="left">{row.address}</StyledTableCell>
                                        <StyledTableCell align="left">{row.cell}</StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer >
            </div>
        </div>
    );
}

export default UsersTable;
