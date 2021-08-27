import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IPage from '../../interfaces/page';
import logging from '../../config/logging';
import { domainToUnicode } from 'url';

const PostsPage: React.FunctionComponent<IPage> = props => {

    interface IPost {
        id: number,
        userId: number,
        title: string,
        body: string
    }

    // HOOK TO RECEIVE POSTS FROM AXIOS
    const [post, setPost] = useState<IPost[]|[]>([]);

    // HOOK TO FILTER POSTS FROM THE FIRST HOOK
    const [filtPost, setFiltPost] = useState<IPost[]|[]>([]);

    // HOOK TO DELIVER
    const [partition, setPartition] = useState<IPost[]|[]>([]);
    // const [work, setWork] = useState<IPost[]|[]>([]);
    
    useEffect(() => {
        logging.info(`Loading ${props.name}`);  
    }, [props.name])

    useEffect(()=>{
        fetchPosts();
    },[])

    // SET POSTS ON ORIGINAL HOOK
    const fetchPosts = async () => {
        const res = await getPosts()
        setPost(res);
    }

    const original = () => {
        setFiltPost(post);
        setPartition(post);
    }
    // SET POSTS ON FILTER HOOK
    const clean = () => {
        setPartition(filtPost)
    }
    

    // DELETE POST
    const deletePost = (arg:any) => {
        
        setFiltPost(
            filtPost.filter((item)=>(item?.id !== arg))
        )
    }


    // GET POSTS FROM API
    const getPosts = async () => {
        try {
            let res = await axios.get(`https://jsonplaceholder.typicode.com/posts`)
            return res.data;
        } catch (err:any) {
            console.log(err);
        }
    }



    const userPosts = (opt:string, value:any) => {
        


            switch(opt){
                case "userId":
                    setPartition(
                        filtPost.filter((item)=>(item?.userId == value))
                    )
                    break;
                case "postId":
                    setPartition(
                        filtPost.filter((item)=>(item?.id == value))
                    )
                    break;
                default:
                    clean();
                    break;
            }

    }

    return (
        <div className="containerPost">
            <div className="adminOptions">
                <div className="getButton" onClick={()=>original()}>ORIGINAL</div>     
                <div className="getButton" onClick={()=>clean()}>UPDATE</div>     
                <input className="inputFilters" type="text" name="userId" placeholder="User ID" onChange={(e)=>userPosts(e.target.name, e.target.value)}/>
                <input className="inputFilters" type="text" name="postId" placeholder="Post ID" onChange={(e)=>userPosts(e.target.name, e.target.value)}/>
            </div> 

            <div className="boxPost">

                {partition?.map((card, index)=>(
                    <div className="card" key={index}>
                        <div className="postInfo">
                            {/* <div className="user" onClick={()=>userPosts(card?.userId)}>{card?.userId}</div> */}
                            <div className="user">{card?.userId}</div>
                            <div className="deleteButton" onClick={()=>deletePost(card?.id)}>DELETE</div>
                        </div>
                        <div className="cardInfo">
                            
                            <div className="title">{card?.title.toLocaleUpperCase()}</div>
                            <div className="text">{card?.body}</div>
                        </div>
                            
                    </div>
                    
                ))}

            </div>

        </div>
    )
}

export default PostsPage;