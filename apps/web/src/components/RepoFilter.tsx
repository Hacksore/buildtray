import { Button, Box, TextField, Grid, InputAdornment, FormControl, IconButton } from "@mui/material";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { appSlice } from "../reducers/mainSlice";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { useRef } from "react";

const { setRepoFilterText } = appSlice.actions;

// maybe use a lib?
const debounce = (fn: any, delay: number) => {
  let timerId: number | undefined;
  return (...args: any) => {
    clearTimeout(timerId);

    // @ts-ignore
    timerId = setTimeout(() => fn(...args), delay);
  };
};

export const RepoFilter = () => {
  const searchFieldRef = useRef(null);
  const dispatch = useDispatch();
  const searchTerm = useSelector((state: any) => state.main.repoFilterText);

  // update the redux store debounce on form type
  const onTextFieldChange = useCallback(
    debounce((event: any) => {
      dispatch(setRepoFilterText(event.target.value));
    }, 200),
    []
  );

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item>
          <FormControl fullWidth sx={{ m: 1 }}>
            <TextField
              inputRef={searchFieldRef}
              onChange={onTextFieldChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    {searchTerm && (
                      <IconButton
                        onClick={() => {
                          dispatch(setRepoFilterText(""));
                          // @ts-ignore
                          searchFieldRef.current.value = "";
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
              variant="standard"
              label="Search for a repo"
            />
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};
