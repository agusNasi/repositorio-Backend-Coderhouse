class GetUserDTO{
    constructor(payload){
        this.id = payload._id
        this.firstName = payload.first_name;
        this.lastName = payload.last_name;
        this.email = payload.email;
        this.age = payload.age
        this.githubLogin = payload.github_login
        this.role = payload.role
        this.cart = payload.cart
        this.profilePic = payload.profile_pic
    }
}

class AddUserDTO {
    constructor(payload) {
        this.first_name = payload.firstName;
        this.last_name = payload.lastName;
        this.email = payload.email;
        this.age = payload.age
        this.password = payload.password
        this.github_login = payload.githubLogin
        this.role = payload.role
        this.cart = payload.cart
        this.profile_pic = payload.profilePic
    }
}

class UpdateUserDTO{
    constructor(payload){
        if(payload.firstName){
            this.first_name = payload.firstName
        }
        if(payload.lastName){
            this.last_name = payload.lastName
        }
        if(payload.githubLogin){
            this.github_login = payload.githubLogin
        }
        if(payload.profilePic){
            this.profile_pic = payload.profilePic
        }
        const filteredPayload = {
            email: payload.email,
            age: payload.age,
            password: payload.password,
            role: payload.role,
            cart: payload.cart
        }
        Object.assign(this, filteredPayload)
    }
}

module.exports = {
    GetUserDTO,
    AddUserDTO,
    UpdateUserDTO
}