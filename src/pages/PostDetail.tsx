import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePosts } from '@/hooks/usePosts';
import PublicNavbar from '@/components/PublicNavbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, ArrowLeft, MessageCircle } from 'lucide-react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const commentSchema = Yup.object({
  author: Yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  content: Yup.string().required('Comment is required').min(10, 'Comment must be at least 10 characters'),
});

const PostDetail = () => {
  const { id } = useParams();
  const { posts, addComment } = usePosts();
  const [post, setPost] = useState(posts.find(p => p.id === id));

  useEffect(() => {
    const foundPost = posts.find(p => p.id === id);
    setPost(foundPost);
  }, [id, posts]);

  if (!post) {
    return (
      <div className="min-h-screen">
        <PublicNavbar onSearch={() => {}} />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link to="/">
            <Button variant="default">Go Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PublicNavbar onSearch={() => {}} />
      
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Badge className="mb-4">{post.category}</Badge>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-6 text-muted-foreground mb-8">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(post.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments.length} comments</span>
          </div>
        </div>

        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-12">
          <img
            src={post.image}
            alt={post.title}
            className="object-cover w-full h-full"
          />
        </div>

        <div 
          className="prose prose-lg dark:prose-invert max-w-none mb-16"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <Separator className="my-12" />

        {/* Comments Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <MessageCircle className="h-8 w-8 text-primary" />
            Comments ({post.comments.length})
          </h2>

          {/* Add Comment Form */}
          <Card className="p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Leave a Comment</h3>
            <Formik
              initialValues={{ author: '', content: '' }}
              validationSchema={commentSchema}
              onSubmit={async (values, { resetForm }) => {
                await addComment(post.id, values.author, values.content);
                resetForm();
              }}
            >
              {({ errors, touched }) => (
                <Form className="space-y-4">
                  <div>
                    <Field
                      as={Input}
                      name="author"
                      placeholder="Your Name"
                      className={errors.author && touched.author ? 'border-destructive' : ''}
                    />
                    {errors.author && touched.author && (
                      <p className="text-destructive text-sm mt-1">{errors.author}</p>
                    )}
                  </div>
                  
                  <div>
                    <Field
                      as={Textarea}
                      name="content"
                      placeholder="Write your comment..."
                      rows={4}
                      className={errors.content && touched.content ? 'border-destructive' : ''}
                    />
                    {errors.content && touched.content && (
                      <p className="text-destructive text-sm mt-1">{errors.content}</p>
                    )}
                  </div>
                  
                  <Button type="submit">Post Comment</Button>
                </Form>
              )}
            </Formik>
          </Card>

          {/* Comments List */}
          <div className="space-y-6">
            {post.comments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              post.comments.map(comment => (
                <Card key={comment.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{comment.author}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{comment.content}</p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </section>
      </article>
    </div>
  );
};

export default PostDetail;
