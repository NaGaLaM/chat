import { Model } from "objection";

class UserModel extends Model {
    static get idColumn() { return 'id'; }

    static get tableName() { return 'Users'; }

    $beforeInsert() {
        const date = new Date();
        this.created_at = date;
    }

    $beforeUpdate() {
        const date = new Date();
        this.updated_at = date;
    }

    static async register(data) {
        const user = await UserModel.query().select('*')
            .where('username', data.username)
            .orWhere('email', data.email);
        if (!user[0]) {
            return UserModel.query()
                .insert(data);
        } else if (user[0].username === data.username) {
            return 'username has already used'
        } else if (user[0].email === data.email) {
            return 'email has already used';
        }
    }

    static async activate(data) {
        return UserModel.query()
            .update({ 'isActivated': true })
            .where('activationLink', data)
    }

    static async login(data) {
        return UserModel.query()
            .select('*')
            .where('username', data.username)
    }

    static async getUser(){ 
        return UserModel.query()
        .select('id','username')
    }

    static async saveMessages(data) {
        return UserModel.query()
        .insert(data);
    }
}
export default UserModel;
