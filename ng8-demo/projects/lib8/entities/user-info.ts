export class UserInfo {
    id: string;
    name: string;
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}

export const DEFAULT_USER = new UserInfo('1', 'name1');
export const css = {
    layout: 'layout'
};
