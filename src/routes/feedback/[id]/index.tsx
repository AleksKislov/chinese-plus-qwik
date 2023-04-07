import { component$, useSignal, useStore } from "@builder.io/qwik";
import { Link, routeLoader$ } from "@builder.io/qwik-city";
import { CommentCard } from "~/components/common/comments/comment-card";
import { FlexRow } from "~/components/common/layout/flex-row";
import { PostCard } from "~/components/feedback/post-card";
import { ApiService } from "~/misc/actions/request";
import { type Post } from "..";
import { type Comment } from "~/components/common/comments/comment-card";
import { infoAlertSvg } from "~/components/common/media/svg";
import {
  CommentForm,
  WHERE,
  type CommentIdToReply,
  type Addressee,
} from "~/components/common/comments/comment-form";

export const getPost = routeLoader$(({ params }): Promise<Post> => {
  return ApiService.get(`/api/posts/${params.id}`, undefined, {});
});

export const getComments = routeLoader$(({ params }): Promise<Comment[]> => {
  return ApiService.get(`/api/comments?where=${WHERE.post}&id=${params.id}`, undefined, []);
});

export default component$(() => {
  const post = getPost();
  const comments = getComments();

  const commentIdToReplyStore = useStore<CommentIdToReply>({
    commentId: "",
    name: "",
    userId: "",
  });

  const addressees = useSignal<Addressee[]>([]);

  return (
    <>
      <FlexRow>
        <div class='w-full md:w-1/2 mr-4 mb-3'>
          <div class='mb-3'>
            <Link href={`/feedback`}>
              <button class={`btn btn-sm btn-info btn-outline`} type='button'>
                назад
              </button>
            </Link>
          </div>
          <PostCard post={post.value} isPostPage={true} addressees={addressees} />
          <CommentForm
            contentId={post.value._id}
            where={WHERE.post}
            path={undefined}
            commentIdToReply={commentIdToReplyStore}
            addressees={addressees}
          />
        </div>

        <div class='w-full md:w-1/2'>
          <div class={"prose mb-3"}>
            <h3>Комментарии</h3>
          </div>

          {comments.value.length ? (
            comments.value.map((msg, ind) => (
              <CommentCard
                comment={msg}
                key={ind}
                commentIdToReply={commentIdToReplyStore}
                addressees={addressees}
              />
            ))
          ) : (
            <div class='alert alert-info shadow-lg'>
              <div>
                {infoAlertSvg}
                <span>Еще никто не комментировал</span>
              </div>
            </div>
          )}
        </div>
      </FlexRow>
    </>
  );
});
