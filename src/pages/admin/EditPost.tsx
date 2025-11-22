import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminNavbar from '@/components/AdminNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePosts } from '@/hooks/usePosts';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Loader2, Save } from 'lucide-react';

const postSchema = Yup.object({
  title: Yup.string().required('Title is required').min(10, 'Title must be at least 10 characters'),
  excerpt: Yup.string().required('Excerpt is required').min(20, 'Excerpt must be at least 20 characters'),
  image: Yup.string().url('Must be a valid URL').required('Image URL is required'),
  category: Yup.string().required('Category is required'),
  content: Yup.string().required('Content is required').min(50, 'Content must be at least 50 characters'),
});

const categories = ['Technology', 'Design', 'Business', 'Lifestyle', 'Travel'];

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, getPosts, updatePost } = usePosts();
  
  const post = posts.find(p => p.id === id);

  useEffect(() => {
    if (posts.length === 0) {
      getPosts();
    }
  }, []);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <AdminNavbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Button onClick={() => navigate('/admin/posts')}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Edit Post</CardTitle>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={{
                title: post.title,
                excerpt: post.excerpt,
                image: post.image,
                category: post.category,
                content: post.content,
              }}
              validationSchema={postSchema}
              onSubmit={async (values, { setSubmitting }) => {
                const result = await updatePost({
                  ...post,
                  ...values,
                });
                
                setSubmitting(false);
                if (result.success) {
                  navigate('/admin/posts');
                }
              }}
            >
              {({ errors, touched, isSubmitting, setFieldValue, values }) => (
                <Form className="space-y-6">
                  <div>
                    <Label htmlFor="title">Post Title *</Label>
                    <Field
                      as={Input}
                      id="title"
                      name="title"
                      placeholder="Enter an engaging title..."
                      className={errors.title && touched.title ? 'border-destructive' : ''}
                    />
                    {errors.title && touched.title && (
                      <p className="text-destructive text-sm mt-1">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Excerpt *</Label>
                    <Field
                      as={Input}
                      id="excerpt"
                      name="excerpt"
                      placeholder="A brief summary of your post..."
                      className={errors.excerpt && touched.excerpt ? 'border-destructive' : ''}
                    />
                    {errors.excerpt && touched.excerpt && (
                      <p className="text-destructive text-sm mt-1">{errors.excerpt}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="image">Featured Image URL *</Label>
                    <Field
                      as={Input}
                      id="image"
                      name="image"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      className={errors.image && touched.image ? 'border-destructive' : ''}
                    />
                    {errors.image && touched.image && (
                      <p className="text-destructive text-sm mt-1">{errors.image}</p>
                    )}
                    {values.image && !errors.image && (
                      <div className="mt-2">
                        <img src={values.image} alt="Preview" className="max-h-48 rounded-lg" />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={values.category}
                      onValueChange={(value) => setFieldValue('category', value)}
                    >
                      <SelectTrigger className={errors.category && touched.category ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && touched.category && (
                      <p className="text-destructive text-sm mt-1">{errors.category}</p>
                    )}
                  </div>

                  <div>
                    <Label>Content *</Label>
                    <div className="mt-2">
                      <ReactQuill
                        theme="snow"
                        value={values.content}
                        onChange={(value) => setFieldValue('content', value)}
                        className="bg-background"
                        modules={{
                          toolbar: [
                            [{ header: [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ list: 'ordered' }, { list: 'bullet' }],
                            ['link', 'image'],
                            ['clean'],
                          ],
                        }}
                      />
                    </div>
                    {errors.content && touched.content && (
                      <p className="text-destructive text-sm mt-1">{errors.content}</p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/admin/posts')}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditPost;
