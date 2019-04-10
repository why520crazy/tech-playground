import { Store, Action } from 'ngx-tethys';

export interface UserInfo {
    _id: string;
    name: string;
}

export interface TeamInfo {
    _id: string;
    name: string;
}

export interface AppState {
    me: UserInfo;
    team: TeamInfo;
}

export class AppStateStore extends Store<AppState> {
    constructor() {
        super({
            me: null,
            team: null
        });
    }

    @Action()
    initialize(team: TeamInfo, me: UserInfo) {
        const state = this.snapshot; // or this.getState();
        state.team = team;
        state.me = me;
        this.next(state); // or this.setState(state);
    }

    // 已经不建议使用
    @Action('loadMe')
    loadMe(state: AppState, payload: UserInfo) {
        state.me = payload;
        this.next(state);
    }
}
