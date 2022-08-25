import { useState,useEffect } from 'react';
import './App.css';
import Header from './components/Header/Header';
import Post from './components/Post/Post';
import { db } from './firebase';
import Avatar from '@mui/material/Avatar';

function App() {

  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    setLoading(true);
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot=>{
      setPosts(snapshot.docs.map(doc => (
      {
        id: doc.id,
        post : doc.data()
      }
       )));
      console.log(posts);
      setLoading(false);
    })
  }, []);

  return (
    <div className="app">
      
      <Header 
        user={user}
        email={email}
        password={password}
        name={name}
        setUser={setUser}
        setEmail={setEmail}
        setPassword={setPassword}
        setName={setName}
      />
      {
        user?(
            <div className="user__avatar">
              <Avatar
          className=' mb-2'
          alt={user.displayName}
          src='/img'
          />
            </div>
        ):
        ('')
      }
      {
        loading?(
          <div className="spinner-border holder" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ):
        (
          <div>
            {posts.map(({post,id})=>(
            <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))}
          </div>
        )
      }
    </div>
  );
}

export default App;
