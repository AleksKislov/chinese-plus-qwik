type ObjectId = string;
type CommentId = { _id: ObjectId };
type NumString = string; // e.g. '3.56'
type ISODate = string; // e.g. '2022-05-12T19:56:17.731Z'

type ContentLike = {
  _id: ObjectId;
  user: ObjectId; // user id
  name: string; // user name
};
