import React , { useState ,useEffect }from 'react';
import './App.css';
import Post from './Post';
import { db , auth} from './firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));



function App() {

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts , setPosts] = useState([]);
  const [open, setOpen ] = useState(false);
  const [username , setUsername] = useState('');
  const [email , setEmail] = useState('')
  const [password , setPassword] = useState('')
  const [user , setUser ] = useState(null);
  const [signInOpen , setSignInOpen ] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const signUp =(e)=>{
    e.preventDefault();
    localStorage.setItem('name' , username)
    auth.createUserWithEmailAndPassword(email , password)
    .then((authUser)=>{
      return authUser.updateProfile({
      displayName : username
      });
    })
    .catch(error=>console.log(error.message))
    setOpen(false)
  };

  const signIn =(e)=>{
    e.preventDefault();
    auth.signInWithEmailAndPassword(email,password)
    .catch(error=>console.log(error.message))
    setSignInOpen(false)
  }

  useEffect(()=>{
    const unsub = auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        setUser(authUser);
      }else{
        setUser(null);
      }
    })

    return ()=>{
      unsub();
    }
  },[user , username])

  useEffect(()=>{
   db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot =>{
     setPosts(snapshot.docs.map( doc=>({
      id: doc.id,
      post : doc.data()
      })
      ))
   });
  },[]);

  return (
    <div className="app">
      <div className="app__header">
        <img src="https://agsd.org.uk/wp-content/uploads/2019/02/instagram-logo.png" alt="logo" className="app__headerImage" style={{height:"50px", width:"200px"}}/>
        {
        user ?( <Button type="button" onClick ={()=>auth.signOut()}>Logout</Button> )
      :
      (<div className="app__loginContainer">
      <Button type="button" onClick={()=>setSignInOpen(true)}>Sign In</Button>
      <Button type="button" onClick={handleOpen}>Sign Up</Button>
      </div>)
      }
      </div>
    
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
      <div style={modalStyle} className={classes.paper}>
      <form className="app__signup">
        <center>
          <img src="https://agsd.org.uk/wp-content/uploads/2019/02/instagram-logo.png" alt="logo" className="app__headerImage" style={{height:"50px", width:"200px"}}/>
        </center>
        <Input 
        type="text" 
        placeholder ="username"
        value ={ username }
        onChange = {(e)=>setUsername(e.target.value)}
        color="secondary"
        />
        <Input 
        type="text" 
        placeholder ="email"
        value ={ email }
        onChange = {(e)=>setEmail(e.target.value)}
        color="secondary"
        />
        <Input 
        type="password" 
        placeholder ="password"
        value ={ password } 
        onChange = {(e)=>setPassword(e.target.value)}
        color="secondary"
        />
        <Button type ="submit" onClick ={ signUp }> Sign Up</Button>
      </form>
    </div>
      </Modal>

      <Modal
        open={signInOpen}
        onClose={()=>setSignInOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
      <div style={modalStyle} className={classes.paper}>
      <form className="app__signup">
        <center>
          <img src="https://agsd.org.uk/wp-content/uploads/2019/02/instagram-logo.png" alt="logo" className="app__headerImage" style={{height:"50px", width:"200px"}}/>
        </center>
        <Input 
        type="text" 
        placeholder ="email"
        value ={ email }
        onChange = {(e)=>setEmail(e.target.value)}
        color="secondary"
        />
        <Input 
        type="password" 
        placeholder ="password"
        value ={ password } 
        onChange = {(e)=>setPassword(e.target.value)}
        color="secondary"
        />
        <Button type ="submit" onClick ={ signIn }>Sign In </Button>
      </form>
    </div>
      </Modal>
      <div className ="app__posts">
        <div className="app__postLeft">
      { 
        posts.map(({id ,post})=>(
           <Post key ={id} postId ={id} user ={user} name ={ post.name} caption={post.caption} imageUrl = {post.imageUrl} />
        ))
      }
      { user?.displayName? (<ImageUpload  username ={ user.displayName }/>)
      :
      (<h3>Sorry you need to login to upload</h3>)
      }
      </div>
      <div className="app__postRight">
      <InstagramEmbed
          url='https://instagr.am/p/Zw9o4/'
          maxWidth={320}
          hideCaption={false}
          containerTagName='div'
          protocol=''
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
        />
      <InstagramEmbed
        url='https://instagr.am/p/B_uf9dmAGPw/'
        maxWidth={320}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
      />
     
      </div>
      </div>
   
    </div>
  );
}

export default App;
