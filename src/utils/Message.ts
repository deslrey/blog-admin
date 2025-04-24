import { ElNotification } from "element-plus";

const showMessage = (message: string, type: "success" | "error" | "warning", callback?: Function) => {
    ElNotification({
        title: type === "error" ? "错误" : type === "success" ? "成功" : "警告",
        message,
        type,
        duration: 2000,
        showClose: true,
        offset: 50,
        onClose: () => {
            if (callback) {
                callback();
            }
        },
    });
}


const message = {
    error: (message: string, callback?: Function) => {
        showMessage(message, "error", callback);
    },

    success: (message: string, callback?: Function) => {
        showMessage(message, "success", callback);
    },

    warning: (message: string, callback?: Function) => {
        showMessage(message, "warning", callback);
    }
}

export default message;


