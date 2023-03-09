import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Alert, Paper, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import { mint, NFTMetaData } from "./NFT.js";
import { isReady, Mina, Field } from "snarkyjs";
import { deployWallet } from "./wallet.js";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { File } from "web3.storage";


import { Drawer, useTheme } from '@mui/material';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { purple } from '@mui/material/colors';

const myTheme = createTheme({
  palette: {
    primary: {
      light: '#ff9d3f',
      main: '#ef6c00',
      dark: '#b53d00',
    },
    secondary: {
      light: '#d9c6ff',
      main: '#400b87',
      dark: '#030059',
    },
  },
});


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

let address;
let dataNFTs: any[] | (() => any[]) = [];
let name: string;

await isReady;
const Local = Mina.LocalBlockchain();
Mina.setActiveInstance(Local);
const account1 = Local.testAccounts[0].privateKey;
const account2 = Local.testAccounts[1].privateKey;

let wallet = await deployWallet(account1, account2, Field.zero);

function FileUpload() {

  const [fileToUpload, setFileToUpload] = React.useState<File>();
  const [imageList, setImageList] = React.useState<any[]>(dataNFTs);

  function changeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;

    if (!fileList) return;
    console.log(fileList);
    setFileToUpload(fileList[0]);
  }

  // create a checkbox
  const [checked, setChecked] = React.useState(true);
  

  async function uploadHandler(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
    if (fileToUpload) {
      const formData = new FormData();
      formData.append("image", fileToUpload, fileToUpload.name);
      name = fileToUpload.name;
      console.log(formData.values());

      address = await mint(account1, account2, new NFTMetaData(fileToUpload, new Map()));
      await wallet.update(account1, address.address);
      console.log(address.ipfsUrl);

      dataNFTs.push({
        img: address.ipfsUrl,
        title: name,
      });
      console.log(dataNFTs);

      setFileToUpload(null);
    }
  }

  return (
    <>
      <Container sx={{ width: 300 }}>
        <Stack direction="column" spacing={2}>

          <Button
            variant="contained"
            component="label"
          >
            Upload NFT
            <input
              type="file"
              name="photo"
              id="image"
              onChange={changeHandler}
              hidden />
          </Button>

          <Box bgcolor={myTheme.shadows[11]} />
          <label for="avatar"
            bgcolor={myTheme.shadows[11]}>Choose any other file type</label>
          <Box />
          <input bgcolor={myTheme.shadows[11]}
            type="file"
            id="avatar" name="avatar"
            accept=""></input>
          <Box bgcolor={myTheme.shadows[11]} />
          <Button
            onClick={uploadHandler}
            sx={{ m: 3, p: 2 }}
            variant="contained"
          >
            Mint
          </Button>
          <Box />
        </Stack>
      </Container><Container fixed>
        <GalleryPage imageList={imageList} />
      </Container>
      // if imageList is not empty, show the alert
      if (imageList.length {'>'} 0)
      <Alert severity="success">File was succesfully uploaded!</Alert>
    </>
  );
}

interface BorrowTableProps {
  children?: React.ReactNode;
  imageList: Array<any>;
}

function GalleryPage(props: BorrowTableProps) {
  const { imageList } = props;

  return (

    <Box sx={{}}>
      <ImageList variant="masonry" cols={3} gap={8}>
        {imageList.map((item) => (
          <ImageListItem key={item.img}>
            <img
              crossOrigin="anonymous"
              src={`${item.img}?w=248&fit=crop&auto=format`}
              //srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
              alt={item.title}
            //loading="lazy"
            />
            <ImageListItemBar
              position="below"
              title={item.title}
              sx={{ textAlign: "center", fontWeight: 'medium', fontSize: 'h3.fontSize', fontFamily: 'Monospace' }}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}

/*
    <ImageList>
      {imageList.map((item) => (
        <ImageListItem key={item.img}>
          <img
              crossOrigin="anonymous"
            src={item.img}
            //srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
            alt={item.title}
            //loading="lazy"
          />
          <ImageListItemBar
            title={item.title}
            position="below"
            sx={{textAlign: "center", fontWeight: 'medium', fontSize: 'h3.fontSize', fontFamily: 'Monospace'}}
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
*/


function LoginPage() {

  const [FilecoinTokenAPI, setFilecoinTokenAPI] = useState("")

  return (
    <Container
      maxWidth="sm"
      sx={{ mt: 10 }}
    >
      <Box
        bgcolor={myTheme.palette.primary.main}
        sx={{ borderRadius: 3, }}
      >
        <Typography
          sx={{ pl: 3, p: 4, fontWeight: 'medium', typography: 'body1', fontSize: 'h6.fontSize', letterSpacing: 6, fontFamily: 'Monospace' }}
        >
          FileCoin API Key:
        </Typography>

        <form>
          <TextField
            onChange={(e) => setFilecoinTokenAPI(e.target.value) 
            }

            sx={{ p: 3, width: 410 }}
            variant="standard"
          >
          </TextField>
        </form>

        <Button
          onClick={() => console.log(FilecoinTokenAPI)}
          sx={{ m: 3, p: 2 }}
          variant="contained"
        >
          Submit
        </Button>                  

        if (FilecoinTokenAPI == "") {
          <Alert severity="error">The Id is incorrect</Alert>
        }
      </Box>
    </Container>
  )
}


function App() {

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Login" {...a11yProps(0)} />
            <Tab label="UploadPage" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <LoginPage />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <FileUpload />
          <GalleryPage imageList={dataNFTs} />
        </TabPanel>
      </Box>
    </>
  );
}


ReactDOM.render(<App />, document.querySelector('#root'));