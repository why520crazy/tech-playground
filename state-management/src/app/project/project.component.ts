import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { produce } from 'ngx-tethys';
import { BehaviorSubject, Subscription, Observable, Observer } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

interface ViewInfo {
    name: string;
}

export class ProjectService {
    views$: BehaviorSubject<ViewInfo[]> = new BehaviorSubject([]);

    views:[];
    addView(view: ViewInfo) {
        const views = this.views$.value;
        views.push(view);
        this.views$.next([...views]);
        // this.views$.next(produce(this.views$.value).add(view));
    }

    updateView(viewId: string, view: ViewInfo) {
        const views = this.views$.value;
        this.views$.next(produce(views).update(viewId, view));
    }

    removeView(viewId: string) {
        const views = this.views$.value;
        this.views$.next(produce(views).remove(viewId));
    }
}

export function splitAsTwoPieces<T>(array: T[], firstSize: number) {
    const firstArray: T[] = [];
    const twoArray: T[] = [];
    array.forEach((item, index) => {
        if (index < firstSize) {
            firstArray.push(item);
        } else {
            twoArray.push(item);
        }
    });
    return [firstArray, twoArray];
}

@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss'],
    providers: [ProjectService]
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectComponent implements OnInit, OnDestroy {
    subscription: Subscription;

    constructor(private projectService: ProjectService, private route: ActivatedRoute) {}

    ngOnInit() {
        // const p = new Promise((resolve)=>{
        //     ///
        //     resolve();
        // });
        // const o = Observable.create((observer: Observer<string>)=>{
        //     //
        //     console.log(``);
        //     observer.next('1');
        //     observer.next('2');
        //     observer.complete();
        // });
        this.subscription = this.projectService.views$.subscribe(views => {
            const [visibleViews, moreViews] = splitAsTwoPieces(views, 3);
            // ... more logic
        });
        this.route.paramMap.subscribe(params => {});
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
