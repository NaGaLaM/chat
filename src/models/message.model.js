import { Model } from "objection";

export default class MessagesModel extends Model {
    static get idColumn() {return 'sender';}

    static get tableName() {return 'messages';}

    $beforeInsert() {
        const date = new Date();
        this.created_at = date;
    }
    static async saveMessages (data) {
        return MessagesModel.query()
        .insert(data)
        .returning('*')
    }

    static async getMessages(sender,recipient) {
        return MessagesModel.query()
        .select('*')
        .where({sender})
        .orWhere('sender',recipient)
        .orWhere({recipient})
        .orWhere('recipient',sender)
    }

}