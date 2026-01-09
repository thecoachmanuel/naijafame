import { prisma } from "@/lib/prisma";
import PostForm from "@/components/PostForm";
import { notFound } from "next/navigation";

export default async function EditPostPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const post = await prisma.post.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    notFound();
  }

  // Convert dates to string or just pass simple objects if needed, 
  // but PostForm expects specific shape. 
  // We need to ensure nulls are handled (Prisma returns null, React props don't like undefined sometimes, but null is fine).
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <PostForm initialData={post} isEditing={true} />
    </div>
  );
}
