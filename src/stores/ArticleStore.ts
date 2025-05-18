import type { ArticleVO } from "@/types/Article";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useArticleStore = defineStore('articleStore', () => {
    const article = ref<ArticleVO | null>(null);
    const articleId = ref<number | null>(null)
    const state = ref<boolean | null>(null)
    const content = ref<string>('')

    const setArticle = (date: ArticleVO) => {
        article.value = date
    }

    const setArticleId = (id: number) => {
        articleId.value = id
    }

    const setState = (bool: boolean) => {
        state.value = bool
    }

    const setContent = (data: string) => {
        content.value = data
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

    const getContent = (): string => {
        return content.value
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

    const clearContent = () => {
        content.value = ''
    }

    return {
        article, articleId, state, content,
        setArticle, setArticleId, setState, setContent,
        getArticle, getArticleContent, getArticleId, getState, getContent,
        clearArticle, clearArticleId, clearState, clearContent
    }
})