import API from "../../utils/API"


export const UpdatePassword = (data) => async (dispatch) => {

    const { userId, oldPassword, newPassword } = data
    console.log(userId, oldPassword, newPassword)
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/UserEmployee/UserSetNewPassword',
            requireAuth: true,
            requestConfig: {
                userId: userId,
                oldpassword: oldPassword,
                newPassword: newPassword
            }
        })
        if (res.responseType == 1) {
            return true
        }
    } catch (error) {
        throw new Error(error)
    }
}