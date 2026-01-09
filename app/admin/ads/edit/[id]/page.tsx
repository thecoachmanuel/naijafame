import { prisma } from "@/lib/prisma";
import AdForm from "@/components/AdForm";
import { notFound } from "next/navigation";

export default async function EditAdPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const ad = await prisma.ad.findUnique({
    where: { id: params.id },
  });

  if (!ad) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Ad</h1>
      <AdForm initialData={ad} isEditing={true} />
    </div>
  );
}
