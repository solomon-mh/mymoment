import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

type PostStatsProps = {
  post: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const likeList = post.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState(likeList);
  const [isSaved, setIsSaved] = useState(false);
  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSaving } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isDeletingSaved } =
    useDeleteSavedPost();
  const { data: currentUser } = useGetCurrentUser();
  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  );

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser, savedPostRecord]);

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    let newLikes = [...likes];
    const hasLiked = newLikes.includes(userId);
    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
    }
    setLikes(newLikes);
    likePost({ postId: post.$id, likesArray: newLikes });
  };
  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (savedPostRecord) {
      setIsSaved(false);
      return deleteSavedPost(savedPostRecord.$id);
    } else {
      savePost({ userId: userId, postId: post.$id });
      setIsSaved(true);
    }
  };

  return (
    <div className='flex justify-between items-center z-20'>
      <div className='flex gap-2 mr-5'>
        <img
          src={`${
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt='liked'
          width={20}
          height={20}
          className='cursor-pointer'
          onClick={(e) => handleLikePost(e)}
        />
        <p className='small-medium lg:base-medium'>{likes.length}</p>
      </div>
      <div className='flex gap-2'>
        {isSaving || isDeletingSaved ? (
          <Loader className='animate-spin' />
        ) : (
          <img
            src={`${
              isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"
            }`}
            alt='liked'
            width={20}
            height={20}
            className='cursor-pointer'
            onClick={handleSavePost}
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;
