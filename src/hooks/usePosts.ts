import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import axios from "axios";
import {
  setPosts,
  addPost as addPostAction,
  updatePost as updatePostAction,
  deletePost as deletePostAction,
  addComment as addCommentAction,
  setLoading,
  setError,
  Post,
  Comment,
} from "@/store/slices/postsSlice";
import { toast } from "@/hooks/use-toast";

const API_BASE = "https://jsonplaceholder.typicode.com";

export const usePosts = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((s: RootState) => s.posts);

  const getPosts = async () => {
    try {
      dispatch(setLoading(true));
      const [postsRes, usersRes, photosRes, commentsRes, todosRes] =
        await Promise.all([
          axios.get(`${API_BASE}/posts?_limit=100`),
          axios.get(`${API_BASE}/users`),
          axios.get(`${API_BASE}/photos?_limit=500`),
          axios.get(`${API_BASE}/comments`),
          axios.get(`${API_BASE}/todos`),
        ]);

      const postsData = postsRes.data as any[];
      const users = usersRes.data as any[];
      const photos = photosRes.data as any[];
      const comments = commentsRes.data as any[];
      const todos = todosRes.data as any[];

      const mapped: Post[] = postsData.map((p) => {
        const user = users.find((u) => u.id === p.userId) || null;
        const photo = photos.find((ph) => ph.id === p.id) || null;
        const postComments = comments
          .filter((c) => c.postId === p.id)
          .map((c) => ({
            id: String(c.id),
            postId: String(c.postId),
            author: c.email || c.name || "User",
            content: c.body,
            createdAt: new Date().toISOString(),
          }));

        const userTodos = todos.filter((t) => t.userId === p.userId);

        return {
          id: String(p.id),
          title: p.title,
          content: `<p>${p.body}</p>`,
          excerpt: p.body.slice(0, 120) + (p.body.length > 120 ? "..." : ""),
          image: photo?.url || `https://picsum.photos/seed/${p.id}/800/400`,
          category: "General",
          author: user?.name || "API User",
          createdAt: new Date().toISOString(),
          comments: postComments,
          user,
          photo: photo
            ? { url: photo.url, thumbnailUrl: photo.thumbnailUrl }
            : null,
          todos: userTodos,
        } as Post;
      });

      // Keep local posts (id >= 1000) at top so user-created posts persist in UI
      const localPosts = posts.filter((p) => {
        const numeric = Number(p.id);
        return isNaN(numeric) ? true : numeric >= 1000;
      });

      dispatch(setPosts([...localPosts, ...mapped]));
    } catch (err) {
      dispatch(setError("Failed to fetch posts"));
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const addPost = async (post: Omit<Post, "id" | "comments">) => {
    try {
      dispatch(setLoading(true));
      // simulate API create (returns id 101..)
      const res = await axios.post(`${API_BASE}/posts`, {
        title: post.title,
        body: post.content.replace(/<[^>]+>/g, ""), // store plain body in API mock
      });

      const newId = String(Number(res.data.id) + 1000 || Date.now() + 1000);

      const newPost: Post = {
        ...post,
        id: newId,
        comments: [],
      };

      dispatch(addPostAction(newPost));
      toast({ title: "Success!", description: "Post created successfully" });
      return { success: true, post: newPost };
    } catch (err) {
      dispatch(setError("Failed to create post"));
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updatePost = async (post: Post) => {
    try {
      dispatch(setLoading(true));
      // If post is original API (id <= 100) call PUT, otherwise update local only
      const numeric = Number(post.id);
      if (!isNaN(numeric) && numeric <= 100) {
        await axios.put(`${API_BASE}/posts/${post.id}`, {
          title: post.title,
          body: post.content.replace(/<[^>]+>/g, ""),
        });
      }
      dispatch(updatePostAction(post));
      toast({ title: "Success!", description: "Post updated successfully" });
      return { success: true };
    } catch (err) {
      dispatch(setError("Failed to update post"));
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const deletePost = async (id: string) => {
    try {
      dispatch(setLoading(true));
      const numeric = Number(id);
      if (!isNaN(numeric) && numeric <= 100) {
        await axios.delete(`${API_BASE}/posts/${id}`);
      }
      dispatch(deletePostAction(id));
      toast({ title: "Success!", description: "Post deleted successfully" });
      return { success: true };
    } catch (err) {
      dispatch(setError("Failed to delete post"));
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
      return { success: false };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const addComment = async (
    postId: string,
    author: string,
    content: string
  ) => {
    try {
      const comment: Comment = {
        id: Date.now().toString(),
        postId,
        author,
        content,
        createdAt: new Date().toISOString(),
      };
      // You can POST to /comments to simulate but we'll keep comments local
      dispatch(addCommentAction(comment));
      toast({
        title: "Comment added!",
        description: "Your comment has been posted.",
      });
      return { success: true };
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  return {
    posts,
    loading,
    error,
    getPosts,
    addPost,
    updatePost,
    deletePost,
    addComment,
  };
};
