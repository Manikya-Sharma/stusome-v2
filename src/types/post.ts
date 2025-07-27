export type Post = {
  id: string;
  title: string;
  author: string;
  content: string;
  discussions: Array<string>;
  tags: Array<string>;
  coverImgFull: string;
  published: boolean;
  media: Array<{ key: string; type: string }>;
};

export type Discussion = {
  id: string;
  content: string;
  author: string;
  replies: Array<string>;
};

export type Reply = {
  id: string;
  content: string;
  author: string;
};
