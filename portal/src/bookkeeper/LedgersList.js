/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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
        Create Ledger
      </Button>
      <Button variant="contained" onClick={handleClickDelLedgers}>
        Delete Ledger
      </Button>
      <Dialog open={dialogOpen} onClose={handlePutLedger}>
        <DialogTitle>Create Ledger</DialogTitle>
        <DialogContent>
          <DialogContentText>Confirm create ledger?</DialogContentText>
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
