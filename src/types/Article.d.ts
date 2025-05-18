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
    exist: boolean
}