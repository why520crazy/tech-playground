import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';

export type Constructor<T> = new (...args: any[]) => T;

export class AnonymousClass {}

export class MixinBase {}

export interface ThyUnsubscribe extends OnDestroy {
    ngUnsubscribe$: Subject<any>;
}

/** Mixin to augment a directive with a `disableRipple` property. */
export function mixinUnsubscribe<T extends Constructor<{}>>(base: T): Constructor<ThyUnsubscribe> & T {
    return class Mixin extends base {
        ngUnsubscribe$ = new Subject();

        constructor(...args: any[]) {
            super(...args);
        }

        ngUnsubscribeReinitialize() {
            this.ngUnsubscribe$.next();
            this.ngUnsubscribe$.complete();
            this.ngUnsubscribe$ = new Subject();
        }

        ngOnDestroy() {
            console.log(`ngOnDestroy`);
            this.ngUnsubscribe$.next();
            this.ngUnsubscribe$.complete();
        }
    };
}
const ngOnDestroyReturn = Symbol('ngOnDestroyReturn');
class ComponentBase implements OnDestroy, OnInit {
    constructor() {}

    ngOnInit() {
        console.log(`ngOnInit`);
    }

    ngOnDestroy() {
        console.log(`ngOnDestroy`);
        // return ngOnDestroyReturn;
    }
}
@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent extends ComponentBase implements OnInit, OnDestroy {
    constructor() {
        super();
    }

    // ngOnInit() {
    //     console.log(`ngOnInit`);
    // }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}
