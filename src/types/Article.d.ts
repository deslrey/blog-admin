export interface ArticleDetail {
    title: string;
    author: string;
    description: string;
    createTime: Date | null;
    updateTime: Date | null;
    wordCount: number;
    readTime: number;
    cover: string;
    content: string;
}

export interface ArticleVO {
    id: number | null,
    title: string;
    author: string;
    imagePath: string;
    description: string;
    storagePath: string
    tags: string,
    category: string,
    createTime: Date | null;
    updateTime: Date | null;
    wordCount: number;
    readTime: number;
    content: string;
    pageViews: number,
    exist: boolean
}

export interface ArticleDraftVO {
    id: number | null,
    articleId: number | null,
    title: string;
    author: string;
    imagePath: string;
    description: string;
    storagePath: string
    tags: string,
    category: string,
    createTime: Date | null;
    updateTime: Date | null;
    wordCount: number;
    readTime: number;
    content: string;
    exist: boolean
}


export interface ArticleView {
    title: string,
    pageViews: number
}