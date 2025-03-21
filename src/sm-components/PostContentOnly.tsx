import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface PostContentOnlyProps {
  content: string;
  limit?: number;
}

export default function PostContentOnly({ content, limit = 150 }: PostContentOnlyProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Render a truncated version if content is longer than the limit.
  const truncatedContent = content.length > limit ? content.slice(0, limit) + "..." : content;

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="relative z-10 flex items-center justify-center h-full overflow-hidden w-full bg-gray-800 text-white text-center p-4 cursor-pointer"
      >
        {truncatedContent}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg p-6 bg-gray-800 rounded-lg">
          <DialogTitle className="text-xl font-bold text-white mb-4">Full Post</DialogTitle>
          <p className="text-white whitespace-pre-wrap">{content}</p>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
