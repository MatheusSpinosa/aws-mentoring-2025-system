interface IArticle {
  currency: string;
  price: number;
  amount: number;
  date: Date;
  op: string;
}

type ArticleState = {
  articles: IArticle[]
}

type ArticleAction = {
  type: string
  article: IArticle
}

type DispatchType = (args: ArticleAction) => ArticleAction