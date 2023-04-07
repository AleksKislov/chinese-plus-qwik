import { component$, type Signal, useContext } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { userContext } from "~/root";
import { msgTypes, type Post } from "~/routes/feedback";
import { type Addressee } from "../common/comments/comment-form";
import { UserDateDiv } from "../common/comments/user-with-date";
import { commentSvg } from "../common/media/svg";

type PostCardProps = {
  post: Post;
  isPostPage: boolean;
  addressees: Signal<Addressee[]>;
};

export const PostCard = component$(({ post, isPostPage, addressees }: PostCardProps) => {
  const {
    _id,
    avatar,
    title,
    tag,
    user: userId,
    name: userName,
    date,
    comments_id: commentIds,
    text,
  } = post;
  const userState = useContext(userContext);
  const ownsPost = userState._id === userId;

  return (
    <div class='card w-full bg-neutral mb-3'>
      <div class='card-body'>
        <div class='flex'>
          <div
            class='tooltip tooltip-info'
            data-tip={ownsPost ? "Это вы" : "Обратиться к пользователю"}
          >
            <div class='avatar mr-4'>
              <div
                class='w-12 mask mask-squircle'
                onClick$={() => {
                  if (ownsPost || addressees.value.some((x) => x.id === userId)) return;
                  addressees.value = [
                    ...addressees.value,
                    {
                      id: userId,
                      name: userName,
                    },
                  ];
                }}
              >
                <img src={`https:${avatar}`} />
              </div>
            </div>
          </div>
          <div>
            <h2 class='card-title mb-1 hover:text-accent'>
              {isPostPage ? title : <Link href={`/feedback/${_id}`}>{title}</Link>}
            </h2>
            <span class='badge badge-info mr-1 badge-outline ml-2'>{msgTypes[tag]}</span>
          </div>
        </div>
        <p class={"mt-2"} dangerouslySetInnerHTML={text}></p>

        <div class={"flex justify-between"}>
          <UserDateDiv userId={userId} userName={userName} date={date} />

          {!isPostPage && (
            <div class={""}>
              <Link href={`/feedback/${post._id}`}>
                <button class='btn btn-info btn-sm btn-outline float-right'>
                  {commentSvg}{" "}
                  {commentIds.length > 0 && <span class={"ml-1"}>{commentIds.length}</span>}
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
