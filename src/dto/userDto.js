export default class UserDto {
    id;
    username;
    isActivated;

    constructor(id, username, isActivated) {
        this.id = id;
        this.username = username;
        this.isActivated = isActivated;
    }
}