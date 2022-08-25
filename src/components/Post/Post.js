/* eslint-disable react-hooks/exhaustive-deps */
import Avatar from '@mui/material/Avatar';
import React, { useEffect, useState } from 'react';
import './Post.css';
import {db,firebase} from '../../firebase';

const Post = ({username,imageUrl,caption,postId,user}) => {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if(postId){
            unsubscribe =  db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp','asc')
            .onSnapshot(snapshot=>{
                setComments(snapshot.docs.map(doc => doc.data() ));
            }); 
        }
        return () =>{
            unsubscribe(); 
        }
        
    }, [] ) 

    const postComment = e =>{
        e.preventDefault();
        db.collection("posts")
        .doc(postId).collection("comments")
        .add({
            text:comment,
            username:user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

    return (
        <div className='post'>
            <div className="post__header">
                <Avatar
                    className='post__avatar'
                    alt={username}
                    src='/img'
                />
                <h3 >{username}</h3>
            </div>
            
            <img className="post__image" src={imageUrl} alt="post" />
            <p className="post__text"><strong>{username}</strong> {caption}</p>

            <div className="post__comments">
                {
                    comments.map(comment=>(
                        <p>
                            <strong>{comment.username}</strong> {comment.text}
                        </p>
                    ))
                }
            </div>

            {
                user?(<form className="post__commentBox">
                <input
                className="post__input" 
                type="text" 
                placeholder="Add a comment..." 
                value={comment}
                onChange={e => setComment(e.target.value)}
                />
                <button
                 disabled={!comment}
                 className="post__button"
                 type="submit"
                 onClick={postComment}
                >
                    post
                </button>
            </form>):(
                ''
            )
            }
        </div>
    );
};

export default Post;