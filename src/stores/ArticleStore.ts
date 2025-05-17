import type { ArticleVO } from "@/types/Article";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useArticleStore = defineStore('articleStore', () => {
    const article = ref<ArticleVO | null>(null);
    const articleId = ref<number | null>(1)

    const setArticle = (date: ArticleVO) => {
        article.value = date
    }

    const setArticleId = (id: number) => {
        articleId.value = id
    }

    const getArticle = (): ArticleVO | null => {
        return article.value
    }

    const getArticleId = (): number | null => {
        return articleId.value
    }

    const getArticleContent = (): string | null => {
        if (article.value?.content) {
            return article.value.content
        }
        return null
    }

    const clearArticle = () => {
        article.value = null
    }

    const clearArticleId = () => {
        articleId.value = null
    }


    return { article, articleId, setArticle, setArticleId, getArticle, getArticleContent, getArticleId, clearArticle, clearArticleId }
})