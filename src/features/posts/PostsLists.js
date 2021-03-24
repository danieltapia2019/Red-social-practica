import {useSelector,useDispatch} from "react-redux";
import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import PostAuthor from '../users/PostAuthor';
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import {selectAllPosts,fetchPosts} from './postsSlice';



export default function PostsList() {
    
    const posts = useSelector(selectAllPosts);
    const dispatch = useDispatch();

    const postStatus = useSelector(state => state.posts.status);
    const error = useSelector (state => state.posts.error);
    useEffect(() => {
        if(postStatus === "idle"){
            dispatch(fetchPosts())
        }
    },[postStatus,dispatch])


    let content;
    if(postStatus === "loading"){
        content = <div className="loader">Cargando...</div>
    } else if(postStatus === "succeeded"){
        const orderedPosts = posts.slice().sort((a,b) => b.date.localeCompare(a.date));
        content = orderedPosts.map( post => (
            <article className="post-excerpt" key = {post.id}>
                <h3>{post.title}</h3>
                <p className="post-content">{post.content.substring(0,100)}</p>
                <PostAuthor userId={post.user}/>
                <TimeAgo timestamp = {post.date}/>
                <ReactionButtons post={post}/>
                <Link to={`/posts/${post.id}`} className="button muted-button">View Post</Link>
            </article>
        ))
    }else if(postStatus === "failed"){
        content = <div>{error}</div>
    }

    return (
        <section className="posts-list">
            <h2>Posts</h2>
            {content}
        </section>
    )
}