import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as api from '../api';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import Box from '@mui/material/Box';
import { useSelector, useDispatch } from 'react-redux';
import { set } from '../store/reducer';

const updateTickersInterval = 10 * 1000;

// TODO: split into components
export default function DataTable() {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const {
    rows,
    filteredRows,
    tickers,
    filteredTickers,
    currency,
    filter,
    amount,
    orderBy,
    order,
  } = state;

  const columns = [
    {
      label: 'Name',
      value: 'name'
    },
    {
      label: `Current Price${currency && rows.length ? ` in ${currency}` : ''}`,
      value: 'value'
    },
  ];

  const { query } = useParams();

  const updateTickers = async () => {
    const assets = await api.getAssets();
    const pairs = Object.keys(assets);
    if (pairs.length === 0) return;
    const res = await api.getTickers(pairs);
    dispatch(set(['tickers', res]));
  };

  const getTickersNamesFilteredByCurrency = () => {
    const keys = Object.keys(tickers);
    if (keys.length === 0) return;
    return keys.reduce((filtered, key) => {
      const regExp = new RegExp(`${currency.toLowerCase()}$`);
      if (!currency || regExp.test(key.toLowerCase())) {
        filtered.push({
          label: key.replace(currency, ''),
          name: key
        });
      }
      return filtered;
    }, []);
  };

  const getRowsWithDroppedValues = (filteredT = filteredTickers || []) => {
    return filteredT
      .reduce((filtered, { name, label }) => {
        const ticker = tickers[name];
        if (ticker) {
          filtered.push({
            name: label,
            value: ticker.a?.[0] * (amount > 0 ? amount : 1),
          });
        }
        return filtered;
      }, []);
  };

  useEffect(() => {
    updateTickers();
    const intervalId = setInterval(() => updateTickers(), updateTickersInterval);
    toFilter(query);
    return clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const newRows = getRowsWithDroppedValues(filteredTickers);
    dispatch(set(['rows', newRows]));
  }, [amount]);

  useEffect(() => {
    const newRows = getRowsWithDroppedValues(filteredTickers);
    dispatch(set(['rows', newRows]));
  }, [amount]);

  useEffect(() => {
    const filtered = getTickersNamesFilteredByCurrency();
    dispatch(set(['filteredTickers', filtered]));
    const newRows = getRowsWithDroppedValues(filtered);
    dispatch(set(['rows', newRows]));
  }, [currency, tickers]);

  useEffect(() => {
    toFilter(filter);
  }, [rows]);

  const toFilter = (value) => {
    if (!value) {
      dispatch(set(['filteredRows', rows]));
      return;
    }
    dispatch(set(['filter', value.toUpperCase()]));
    const filteredRows = rows.filter(({ name }) => {
      return name.toLowerCase().includes(value.toLowerCase());
    });
    dispatch(set(['filteredRows', filteredRows]));
  };

  const createSortHandler = (property) => () => {
    const isAsc = orderBy === property && order === 'asc';
    dispatch(set(['order', isAsc ? 'desc' : 'asc']));
    dispatch(set(['orderBy', property]));
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  return (
    <Container maxWidth="md" sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" my={2} spacing={2}>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <TextField
            variant="outlined"
            label="Your currency"
            value={currency}
            onChange={(e) => dispatch(set(['currency', e.target.value.toUpperCase()]))}
          />
          <TextField
            variant="outlined"
            label="Asset amount"
            value={amount}
            onChange={({ target: { value } }) => dispatch(set(['amount', value]))}
          />
          <TextField
            variant="outlined"
            label="Filter"
            value={filter}
            onChange={({ target: { value } }) => toFilter(value)}
          />
        </Stack>
        {
          !!filteredRows.length &&
          <Typography variant="button">
            {filteredRows.length} items total
          </Typography>
        }
      </Stack>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {
                  columns.map(({ label, value }, i) => {
                    return (
                      <TableCell key={value + i}>
                        <TableSortLabel
                          active={orderBy === value}
                          direction={orderBy === value ? order : 'asc'}
                          onClick={createSortHandler(value)}
                        >
                          <strong>
                            {label}
                          </strong>
                          {
                            orderBy === value ? (
                              <Box component="span" sx={visuallyHidden}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                              </Box>
                            ) : null
                          }
                        </TableSortLabel>
                      </TableCell>
                    );
                  })
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {
                filteredRows.slice().sort(getComparator(order, orderBy))
                  .map((row) => {
                    return (
                      <TableRow key={row.name}>
                        {
                          columns.map(({ value }) => {
                            return <TableCell key={value}>{row[value]}</TableCell>;
                          })
                        }
                      </TableRow>
                    );
                  })
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}
