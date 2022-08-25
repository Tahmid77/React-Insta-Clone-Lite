import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import React, {  useState } from 'react';
import {db,storage,firebase} from '../../firebase';
import TextField from '@mui/material/TextField';

const ImageUpload = ({username}) => {

    const [image,setImage] = useState(null);
    const [progress,setProgress] = useState(0);
    const [caption,setCaption] = useState('');
    const [upload,setUpload] = useState(false);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    const handleChange = (e) =>{
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () =>{
        setUpload(true);
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_change",
            (snapshot)=>{
                const progress =Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes) *100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
                setUpload(false);
            },
            ()=>{
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url=>{
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username:username
                    });
                    setProgress(0);
                    setCaption('');
                    setImage(null);
                    handleClose();
                    setUpload(true);
                })
            }
        )
    };
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
    return (
        <div>
            <Button sx={button_style} variant="outlined" onClick={handleOpen} color='success'>Upload</Button>
            <Modal
           open={open}
           onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
                <h2 style={{margin: '10px 0px 0 0'}}>Create a Post</h2>
                <TextField
                sx={{mb:2}}
                autoComplete="caption"
                name="caption"
                variant="standard"
                required
                fullWidth
                id="caption"
                label="Add a caption.."
                value={caption}
                onInput={e=> setCaption(e.target.value)}
              />
                <Button
                variant="contained"
                component="label"
                >
                Upload File
                    <input
                    type="file"
                    hidden
                    onChange={handleChange}
                    />
                </Button><br />
                <progress value={progress} max="100" /><br />
                <Button variant="outlined"  onClick={handleUpload}>
                {
                upload?(<div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                          </div>):('Upload')
                }
                </Button>
            </Box>
          </Modal>
            
        </div>
    );
};

export default ImageUpload;