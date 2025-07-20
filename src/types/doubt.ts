export type DoubtReply = {
  id: string;
  author: string;
  content: string;
};

export type DoubtAnswer = {
  id: string;
  content: string;
  author: string;
  replies: Array<string>;
};

export type Doubt = {
  id: string;
  title: string;
  author: string;
  content: string;
  answers: Array<string>;
  tags: Array<string>;
};
