export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Topic = {
  id: string;
  title: string;
};

export type Question = {
  id: string;
  title: string;
  topic_id: string;
  votes: number;
};

export type Title = {
  id: string;
  title: string;
  synposis: string;
  released: number;
  genre: string;
};

export type UsersTitle = Title & {
  image: string;
  favorited: boolean;
  watchLater: boolean;
};