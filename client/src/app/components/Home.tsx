"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import toast, { Toaster } from "react-hot-toast";

export default function BasicTextFields({
  onSubmit,
}: {
  onSubmit: (deviceId: string) => void;
}) {
  const [deviceId, setDeviceId] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deviceId.trim()) {
      onSubmit(deviceId.trim());
    } else {
      toast.error("Please enter a Device ID");
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          gap: 4,
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="device-id-input"
          label="Device ID"
          variant="standard"
          value={deviceId}
          onChange={(e) => setDeviceId(e.target.value)}
          sx={{
            width: "25ch",
            "& .MuiInputBase-input": {
              color: "white",
            },
            "& .MuiInputLabel-root": {
              color: "black",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "green",
            },
            "& .MuiInput-underline:after": {
              borderBottomColor: "green",
            },
            "& .MuiInput-underline:before": {
              borderBottomColor: "rgba(0,0,0,0.42)",
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="success"
          sx={{ width: "15ch" }}
        >
          Submit
        </Button>
      </Box>
      <Toaster position="top-right" />
    </>
  );
}
