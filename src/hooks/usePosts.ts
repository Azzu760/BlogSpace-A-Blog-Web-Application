import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setPosts, addPost as addPostAction, updatePost as updatePostAction, deletePost as deletePostAction, addComment as addCommentAction, setLoading, setError } from '@/store/slices/postsSlice';
import { Post, Comment } from '@/store/slices/postsSlice';
import { toast } from '@/hooks/use-toast';

// Mock data generator
const generateMockPosts = (): Post[] => {
  const categories = ['Technology', 'Design', 'Business', 'Lifestyle', 'Travel'];
  const authors = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams'];
  
  return Array.from({ length: 12 }, (_, i) => ({
    id: (i + 1).toString(),
    title: `Amazing Blog Post Title ${i + 1}`,
    content: `<p>This is the full content of blog post ${i + 1}. It contains rich text with <strong>bold text</strong>, <em>italic text</em>, and <u>underlined text</u>.</p><p>Here's another paragraph with more details about this amazing topic. The content is engaging and informative.</p><h2>Key Takeaways</h2><ul><li>Point number one</li><li>Point number two</li><li>Point number three</li></ul><p>In conclusion, this blog post demonstrates the power of our blogging platform.</p>`,
    excerpt: `A brief excerpt of blog post ${i + 1} to give readers a taste of what's inside...`,
    image: `https://picsum.photos/seed/${i + 1}/800/400`,
    category: categories[i % categories.length],
    author: authors[i % authors.length],
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    comments: [],
  }));
};

export const usePosts = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state: RootState) => state.posts);

  const getPosts = async () => {
    try {
      dispatch(setLoading(true));
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Initialize with mock data if empty
      if (posts.length === 0) {
        const mockPosts = generateMockPosts();
        dispatch(setPosts(mockPosts));
      } else {
        dispatch(setLoading(false));
      }
    } catch (err) {
      dispatch(setError('Failed to fetch posts'));
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      });
    }
  };

  const addPost = async (post: Omit<Post, 'id' | 'comments'>) => {
    try {
      dispatch(setLoading(true));
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newPost: Post = {
        ...post,
        id: Date.now().toString(),
        comments: [],
      };
      
      dispatch(addPostAction(newPost));
      toast({
        title: "Success!",
        description: "Post created successfully",
      });
      return { success: true, post: newPost };
    } catch (err) {
      dispatch(setError('Failed to create post'));
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  const updatePost = async (post: Post) => {
    try {
      dispatch(setLoading(true));
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch(updatePostAction(post));
      toast({
        title: "Success!",
        description: "Post updated successfully",
      });
      return { success: true };
    } catch (err) {
      dispatch(setError('Failed to update post'));
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  const deletePost = async (id: string) => {
    try {
      dispatch(setLoading(true));
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch(deletePostAction(id));
      toast({
        title: "Success!",
        description: "Post deleted successfully",
      });
      return { success: true };
    } catch (err) {
      dispatch(setError('Failed to delete post'));
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  const addComment = async (postId: string, author: string, content: string) => {
    try {
      const comment: Comment = {
        id: Date.now().toString(),
        postId,
        author,
        content,
        createdAt: new Date().toISOString(),
      };
      
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
