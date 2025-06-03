export interface Visitor {
    id: number,
    ip: string,
    visitCount: number,
    firstVisit: Date,
    lastVisit: Date,
    visitorToken: string,
    isBlock: boolean
}

export interface VisitLog {
    id: number,
    visitorIp: string,
    articleId: number,
    platform: string,
    browser: string,
    device: string,
    province: string,
    city: string,
    visitTime: Date,
    visitDate: Date,
    description: string
    exist: boolean
}