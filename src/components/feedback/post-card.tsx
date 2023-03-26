import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { dateToStr } from "~/misc/helpers/tools";
import { msgTypes, type Post } from "~/routes/feedback";
import { commentSvg } from "../common/media/svg";

type PostCardType = {
  post: Post;
  isPostPage: boolean;
};

export const PostCard = component$(({ post, isPostPage }: PostCardType) => {
  return (
    <div class='card w-full bg-neutral mb-3'>
      <div class='card-body'>
        <div class='flex'>
          <div class='avatar mr-4'>
            <div class='w-12 mask mask-squircle'>
              <img src={`https:${post.avatar}`} />
            </div>
          </div>
          <div>
            <h2 class='card-title mb-1 hover:text-accent'>
              {isPostPage ? post.title : <Link href={`/feedback/${post._id}`}>{post.title}</Link>}
            </h2>
            <small class={"text-accent"}>{dateToStr(post.date, false)}</small>
            <span class='badge badge-info mr-1 badge-outline ml-2'>{msgTypes[post.tag]}</span>
          </div>
        </div>
        <p class={"mt-2"} dangerouslySetInnerHTML={post.text}></p>

        {!isPostPage && (
          <div class={"float-right"}>
            <Link href={`/feedback/${post._id}`}>
              <button class='btn btn-info btn-sm btn-outline float-right'>
                {commentSvg}{" "}
                {post.comments_id.length > 0 && (
                  <span class={"ml-1"}>{post.comments_id.length}</span>
                )}
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
});
