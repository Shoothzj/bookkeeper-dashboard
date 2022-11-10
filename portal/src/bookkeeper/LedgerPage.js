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

import { useParams } from 'react-router';
import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import BACKEND_HOST from '../Const';

function LedgerPage() {
  const { ledger } = useParams();

  const [lac, setLacContent] = useState([]);

  const [content, setContent] = useState([]);

  const [hexContent, setHexContent] = useState([]);

  const [open, setOpen] = React.useState(false);
  const fetchLedger = async () => {
    const response = await fetch(`${BACKEND_HOST}/api/bookkeeper/ledgers/${ledger}`);
    const data = await response.json();
    setContent(data.content);
  };

  const fetchHexLedger = async () => {
    const response = await fetch(`${BACKEND_HOST}/api/bookkeeper/ledgers/
    ${ledger}/last-entry?decodeComponent=Hex&decodeNamespace=ManagedManagedLedgerSubscription`);
    const data = await response.json();
    setHexContent(data.content);
  };

  const fetchLac = async () => {
    const response = await fetch(`${BACKEND_HOST}/api/bookkeeper/ledgers/
    ${ledger}/lac`);
    const data = await response.json();
    setLacContent(data);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [decodeComponent, setDecodeComponent] = React.useState('');

  const [decodeNamespace, setDecodeNamespace] = React.useState('');

  const handleComponentChange = (event) => {
    setDecodeComponent(event.target.value);
  };

  const handleNamespaceChange = (event) => {
    setDecodeNamespace(event.target.value);
  };

  const [decodeData, setDecodeData] = useState({ data: [] });
  const [decodeIsLoading, setDecodeIsLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleClick = async () => {
    setDecodeIsLoading(true);

    const response = await fetch(
      `${BACKEND_HOST}/api/bookkeeper/ledgers/${ledger}/last-entry?decodeComponent=${decodeComponent}&decodeNamespace=${decodeNamespace}`,
    );
    if (!response.ok) {
      setErr(err.message);
      setDecodeIsLoading(false);
      return;
    }

    const result = await response.json();

    setDecodeData(result.content);
    setErr('');
    setDecodeIsLoading(false);
  };

  useEffect(() => {
    fetchLedger();
    fetchLac();
    fetchHexLedger();
  }, []);

  return (
    <div>
      <h1>
        Ledger:
        {ledger}
      </h1>
      <h1>
        LastEntry:
        {lac}
      </h1>
      <Button variant="contained" onClick={handleClickOpen}>
        show hex
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">hex content</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{hexContent}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            close
          </Button>
        </DialogActions>
      </Dialog>
      <h1>Content: </h1>
      <p>{content}</p>
      <Box>
        <h2>Decode as</h2>
        <div>
          <FormControl fullWidth>
            <InputLabel id="decode-component-select-label">DecodeComponent</InputLabel>
            <Select
              labelId="decode-component-select-label"
              id="decode-component-select"
              value={decodeComponent}
              label="DecodeComponent"
              onChange={handleComponentChange}>
              <MenuItem value="Hex">Hex</MenuItem>
              <MenuItem value="Pulsar">Pulsar</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="decode-namespace-select-label">DecodeNamespace</InputLabel>
            <Select
              labelId="decode-namespace-select-label"
              id="decode-namespace-select"
              value={decodeNamespace}
              label="DecodeNamespace"
              onChange={handleNamespaceChange}>
              <MenuItem value="ManagedLedgerTopic">ManagedLedgerTopic</MenuItem>
              <MenuItem value="ManagedManagedLedgerSubscription">
                ManagedManagedLedgerSubscription
              </MenuItem>
            </Select>
          </FormControl>
        </div>
      </Box>
      {err && <h2>{err}</h2>}
      <Button onClick={handleClick} variant="contained">
        Decode
      </Button>
      {decodeIsLoading && <h2>Loading...</h2>}
      {decodeData && <p style={{ whiteSpace: 'pre-wrap' }}>{decodeData.toString()}</p>}
    </div>
  );
}

export default LedgerPage;
