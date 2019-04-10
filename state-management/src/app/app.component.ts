import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, BehaviorSubject, Subscription } from 'rxjs';
import { produce, helpers } from 'ngx-tethys';
import { ActivatedRoute } from '@angular/router';
import { AppStateStore, UserInfo } from './app-state.store';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    private unsubscribe$ = new Subject<void>();

    title = 'state-management';

    subscription: Subscription;

    me: UserInfo;

    constructor(private appStateStore: AppStateStore) {}

    ngOnInit() {
        this.appStateStore
            .select(state => {
                return state.me;
            })
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(me => {
                this.me = me;
            });

        setTimeout(() => {
            this.appStateStore.initialize(
                { _id: '1', name: 'at' },
                {
                    _id: '1',
                    name: 'peter'
                }
            );
            // this.appStateStore.dispatch('loadMe', {
            //     _id: '1',
            //     name: 'lily'
            // });
        }, 3000);
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
