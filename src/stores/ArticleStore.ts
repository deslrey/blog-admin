import type { ArticleVO } from "@/types/Article";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useArticleStore = defineStore('articleStore', () => {
    const article = ref<ArticleVO | null>(null);
    const articleId = ref<number | null>(null)
    const state = ref<boolean | null>(null)

    const setArticle = (date: ArticleVO) => {
        article.value = date
    }

    const setArticleId = (id: number) => {
        articleId.value = id
    }

    const setState = (bool: boolean) => {
        state.value = bool
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

    const getState = (): boolean | null => {
        return state.value
    }

    const clearArticle = () => {
        article.value = null
    }

    const clearArticleId = () => {
        articleId.value = null
    }

    const clearState = () => {
        state.value = null
    }


    return { article, articleId, state, setArticle, setArticleId, setState, getArticle, getArticleContent, getArticleId, getState, clearArticle, clearArticleId, clearState }
})