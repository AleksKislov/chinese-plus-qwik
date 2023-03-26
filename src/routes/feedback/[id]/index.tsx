import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";
import { FlexRow } from "~/components/common/layout/flex-row";
import { PostCard } from "~/components/feedback/post-card";
import { ApiService } from "~/misc/actions/request";
import { type Post } from "..";

type Comment = {
  addressees: string[];
  _id: string;
  text: string;
  name: string;
  avatar: string;
  user: string;
  post_id: string;
  destination: string;
  date: string;
};

export const getPost = routeLoader$(({ params }): Promise<Post> => {
  return ApiService.get(`/api/posts/${params.id}`, undefined, {});
});

export const getComments = routeLoader$(({ params }): Promise<Comment[]> => {
  const where = "post";
  return ApiService.get(`/api/comments?where=${where}&id=${params.id}`, undefined, []);
});

export default component$(() => {
  const post = getPost();
  const comments = getComments();
  return (
    <>
      <FlexRow>
        <div class='w-full md:w-1/2 mb-3 mr-4 h-24'>
          <PostCard post={post.value} isPostPage={true} />
        </div>

        <div class='w-full md:w-1/2'></div>
      </FlexRow>
    </>
  );
});
