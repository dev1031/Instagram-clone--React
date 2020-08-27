import React ,{ useState , useEffect } from 'react'
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import { db } from './firebase';
import firebase from 'firebase'

function Post({ postId , caption ,user , name , imageUrl}) {
    const [comments , setComments] = useState([]);
    const [comment , setComment ] = useState('');
    useEffect(()=>{
        let unsub ;
        if(postId){
            unsub = db.collection("posts").doc(postId).collection("comment").orderBy('timestamp', 'desc')
            .onSnapshot((snapshot)=>{
                setComments(snapshot.docs.map((doc)=>({id : doc.id ,...doc.data()})));
            })
        }
        return()=>{
            unsub();
        }
    },[postId])

    let handleSubmit =(e)=>{
        e.preventDefault();
        db.collection("posts").doc(postId).collection("comment").add({
            text : comment,
            name : user.displayName===null?localStorage.getItem('name'):user.displayName,
            timestamp : firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('')
    }
    return(
        <div className="post">
            <div className="post__header">
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" className="post__avatar" />
                <h3> {name}</h3>
            </div>
            <img src= {imageUrl} alt="post__image" className="post__image"/>
            <h4 className = "post__text"><strong style={{marginRight:"10px"}}>{name}</strong>{caption}</h4>
            <div className ="post__comment">
                { 
                    comments.map((comment,id)=>(
                        <p key ={id} style={{marginTop:"10px"}}>
                            <b style={{marginRight:"10px"}}> { comment.name }</b>{comment.text}
                        </p>
                    ))
                }
            </div>
                { !user?localStorage.getItem('name'):user &&  
                <form className ="post__formBox">
                    <input 
                    className ="post__input"
                    type="text"
                    placeholder ="Add a comment..."
                    value ={ comment}
                    onChange ={(e)=>setComment(e.target.value)}
                    />
                    <button
                        className ="post__button"
                        type = "submit"
                        disabled = {!comment }
                        onClick = { handleSubmit }
                    >post
                    </button>
                </form>}
           
        </div>
        )
}

export default Post
