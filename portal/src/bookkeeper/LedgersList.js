import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BACKEND_HOST from '../Const';

function LedgerList() {
  const columns = [{ field: 'ledger', headerName: 'Ledger', width: 300 }];

  const [ledgers, setLedgers] = useState([]);

  const [dialogOpen, setDialogOpen] = React.useState(false);

  const [ledger, setLedger] = React.useState('');

  const [deleteLedgers, setDeleteLedgers] = React.useState([]);

  const [value, setValue] = React.useState('');

  const handleLedgerChanged = (event) => {
    setLedger(event.target.value);
  };

  const handleDLedgersChanged = (itm) => {
    setDeleteLedgers(itm);
  };

  const handleValueChanged = (event) => {
    setValue(event.target.value);
  };

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const fetchLedgers = async () => {
    const response = await fetch(`${BACKEND_HOST}/api/bookkeeper/ledgers`);
    const data = await response.json();
    setLedgers(data.map((aux) => ({ id: aux, ledger: aux })));
  };

  const handleClickDelLedgers = () => {
    fetch(`${BACKEND_HOST}/api/bookkeeper/ledgers-delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deleteLedgers,
      }),
    });
  };

  const handlePutLedger = () => {
    fetch(`${BACKEND_HOST}/api/bookkeeper/ledgers`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ledger,
        value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setDialogOpen(false);
        setLedger('');
        setValue('');
        fetchLedgers();
      })
      .catch((error) => {});
    setDialogOpen(false);
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchLedgers();
  }, []);

  const handleEvent = (
    params, // GridRowParams
    event, // MuiEvent<React.MouseEvent<HTMLElement>>
    details, // GridCallbackDetails
  ) => {
    navigate(`/bookkeeper/ledgers/${params.row.ledger}`);
  };

  return (
    <div>
      <h1>Ledgers</h1>
      <Button variant="contained" onClick={handleClickOpen}>
        Put Ledger
      </Button>
      <Button variant="contained" onClick={handleClickDelLedgers}>
        Delete Ledger
      </Button>
      <Dialog open={dialogOpen} onClose={handlePutLedger}>
        <DialogTitle>Put Ledger</DialogTitle>
        <DialogContent>
          <DialogContentText>Please form the ledger and value</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="put-ledger"
            label="Ledger"
            value={ledger}
            onChange={handleLedgerChanged}
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="put-value"
            label="Value"
            value={value}
            onChange={handleValueChanged}
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePutLedger}>Cancel</Button>
          <Button onClick={handlePutLedger}>Confirm</Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          onRowClick={handleEvent}
          rows={ledgers}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          onSelectionModelChange={handleDLedgersChanged}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </div>
  );
}

export default LedgerList;
