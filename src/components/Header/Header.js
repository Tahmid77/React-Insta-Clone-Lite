import React,{useState,useEffect} from 'react';
import './Header.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { auth } from '../../firebase';
import ImageUpload from '../ImageUpload/ImageUpload';


const Header = ({user,email,password,name,setUser,setEmail,setName,setPassword}) => {
 
    const [open, setOpen] = useState(false);
    const[loggedIn,setLoggedIn] = useState(false);
    const[signedIn,setSignedIn] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
    const [openLogin, setOpenLogin] = useState(false);
    const handleOpenLogin = () => setOpenLogin(true);
    const handleCloseLogin = () => setOpenLogin(false);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(authUser=>{
        if(authUser){
          console.log(authUser.uid);
          setUser(authUser);
        }else{
          setUser(null);
        }
      })
      return () =>{
        unsubscribe();
      }
    },[setUser] )

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        minWidth: '300px',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
      const button_style = {
        maxWidth: "50px",
        margin: "15px 15px 0 0"
      };


    const handleSignUp = (e) =>{
        setSignedIn(true);
        let err = null;
        e.preventDefault();
        auth.createUserWithEmailAndPassword(email,password)
        .then((authUser) => {
          authUser.user.updateProfile({
            displayName: name
          })
          if(authUser){
            handleClose();
            setPassword('');
            setEmail('');
            setName('');
            setSignedIn(false);
          }
        })
        .catch((error)=>{
          alert(error.message)
          err = error.message;
          if(err!==null){
            setPassword('');
            setEmail('');
            setName(''); 
            setSignedIn(false);
          }
        });
        
    }

    const handleLogin = (e) =>{
      setLoggedIn(true);
      let err = null;
      e.preventDefault();
      auth.signInWithEmailAndPassword(email,password)
      .then((authUser) => {
        console.log(authUser.user);
        handleCloseLogin();
        setPassword('');
        setEmail('');
        setLoggedIn(false);
      })
      .catch((error)=>{
        alert(error.message)
        err = error.message;
        if(err!==null){
          setPassword('');
          setEmail('');
          setName(''); 
          setLoggedIn(false);
        }
      });
      
      
  }

    return (
        <div className='header'>
            <div className="header__logo_container">
                <img className='header__logo' src='/insta-logo.png' alt="logo" />
            </div>
            
            <div>
          {user?(
            <div style={{"display": "flex"}}>
              <ImageUpload username={user.displayName} />
                <Button sx={button_style} variant="outlined" onClick={() => auth.signOut()} color='error'>Logout</Button>
            </div>
            
          ):(<div >
                <Button sx={button_style} variant="outlined" onClick={handleOpen} color='success'>SignUp</Button>
                <Button sx={button_style} variant="outlined" onClick={handleOpenLogin}>Login</Button>
            </div>
          )}
         <Modal
           open={open}
           onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
            <h2 style={{margin: '10px 0px'}}>SignUp</h2>
              <form>
              <TextField
                sx={{mb:2}}
                autoComplete="email"
                name="email"
                variant="standard"
                required
                fullWidth
                id="email"
                label="Email"
                value={email}
                onInput={e=> setEmail(e.target.value)}
              />
              <TextField
                sx={{mb:2}}
                autoComplete="uname"
                name="username"
                variant="standard"
                required
                fullWidth
                id="userName"
                label="User Name"
                value={name}
                onInput={e=> setName(e.target.value)}
              />
              <TextField
                sx={{mb:2}}
                id="outlined-password-input"
                label="Password"
                variant="standard"
                fullWidth
                required
                type="password"
                autoComplete="current-password"
                value={password}
                onInput={e=> setPassword(e.target.value)}
              />
              <Button variant="contained" color="success" onClick={handleSignUp}>
              {
                signedIn?(<div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>):('Submit')
              }
              </Button>
              </form>
            </Box>
          </Modal>
          <Modal
           open={openLogin}
           onClose={handleCloseLogin}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
            <h2 style={{margin: '10px 0px'}}>LogIn</h2>
              <form>
              <TextField
                sx={{mb:2}}
                autoComplete="email"
                name="email"
                variant="standard"
                required
                fullWidth
                id="email"
                label="Email"
                value={email}
                onInput={e=> setEmail(e.target.value)}
              />
              <TextField
                sx={{mb:2}}
                id="outlined-password-input"
                label="Password"
                variant="standard"
                fullWidth
                required
                type="password"
                autoComplete="current-password"
                value={password}
                onInput={e=> setPassword(e.target.value)}
              />
              <Button variant="contained" color="success" onClick={handleLogin}>
              {
                loggedIn?(<div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>):('Submit')
              }
              </Button>
              </form>
            </Box>
          </Modal>
        </div>
        </div>
    );
};

export default Header;