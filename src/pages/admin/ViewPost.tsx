import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { usePosts } from "@/hooks/usePosts";
import PublicNavbar from "@/components/PublicNavbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  User,
  ArrowLeft,
  MessageCircle,
  ImageOff,
} from "lucide-react";

const ViewPost = () => {
  const { id } = useParams();
  const { posts } = usePosts();
  const [post, setPost] = useState(posts.find((p) => p.id === id));

  useEffect(() => {
    const foundPost = posts.find((p) => p.id === id);
    setPost(foundPost);
  }, [id, posts]);

  if (!post) {
    return (
      <div className="min-h-screen">
        <PublicNavbar onSearch={() => {}} />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link to="/posts">
            <Button variant="default">Back to Posts</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PublicNavbar onSearch={() => {}} />

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back Button */}
        <Link
          to="/posts"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Posts
        </Link>

        <Badge className="mb-4 ml-4">{post.category}</Badge>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Author / Date / Comments */}
        <div className="flex items-center flex-wrap gap-6 text-muted-foreground mb-8">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{post.author}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments.length} comments</span>
          </div>
        </div>

        {/* IMAGE OR PLACEHOLDER */}
        {post.image ? (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-12 border">
            <img
              src={post.image}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className="relative w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground mb-12 select-none">
            <ImageOff className="h-16 w-16 mb-3 opacity-50" />
            <p className="text-lg font-medium opacity-60">No image found</p>
          </div>
        )}

        {/* Post Content */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none mb-16"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* ACTION BUTTONS */}
        <div className="flex items-center justify-between">
          <Link to="/admin/posts">
            <Button variant="secondary">Back to Posts</Button>
          </Link>

          <Link to={`/admin/posts/edit/${post.id}`}>
            <Button>Edit Post</Button>
          </Link>
        </div>

        <Separator className="my-6" />

        {/* COMMENTS SECTION (READ ONLY)*/}

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <MessageCircle className="h-8 w-8 text-primary" />
            Comments ({post.comments.length})
          </h2>

          {post.comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              No comments yet.
            </p>
          ) : (
            <div className="space-y-6">
              {post.comments.map((comment) => (
                <Card key={comment.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{comment.author}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-muted-foreground">{comment.content}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </article>
    </div>
  );
};

export default ViewPost;
