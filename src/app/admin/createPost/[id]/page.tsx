// Example usage in a page component
import CreatePostForm from "@/components/admin/createPost";

type Props = {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function CreatePost({ params }: Props) {
  const influencerId = await params.id;
  return (
    <div>
      <h1>Create New Post</h1>
      <CreatePostForm influencerId={influencerId} />
    </div>
  );
}