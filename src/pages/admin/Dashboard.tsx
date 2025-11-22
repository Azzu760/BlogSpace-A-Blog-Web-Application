import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from '@/components/AdminNavbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePosts } from '@/hooks/usePosts';
import { FileText, Eye, MessageCircle, TrendingUp, PlusCircle } from 'lucide-react';

const Dashboard = () => {
  const { posts, getPosts } = usePosts();

  useEffect(() => {
    getPosts();
  }, []);

  const totalComments = posts.reduce((acc, post) => acc + post.comments.length, 0);

  const stats = [
    {
      title: 'Total Posts',
      value: posts.length,
      icon: FileText,
      description: 'Published articles',
      color: 'text-primary',
    },
    {
      title: 'Total Views',
      value: posts.length * 123,
      icon: Eye,
      description: 'Across all posts',
      color: 'text-accent',
    },
    {
      title: 'Comments',
      value: totalComments,
      icon: MessageCircle,
      description: 'User engagements',
      color: 'text-primary',
    },
    {
      title: 'Engagement',
      value: `${totalComments > 0 ? Math.round((totalComments / posts.length) * 100) : 0}%`,
      icon: TrendingUp,
      description: 'Average rate',
      color: 'text-accent',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your blog overview.</p>
          </div>
          <Link to="/admin/posts/create">
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Create New Post
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="card-hover-effect">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Posts</CardTitle>
                <CardDescription>Your latest published articles</CardDescription>
              </div>
              <Link to="/admin/posts">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No posts yet</p>
                <Link to="/admin/posts/create">
                  <Button>Create Your First Post</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.slice(0, 5).map(post => (
                  <div key={post.id} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{post.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString()} • {post.comments.length} comments
                      </p>
                    </div>
                    <Link to={`/admin/posts/edit/${post.id}`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
