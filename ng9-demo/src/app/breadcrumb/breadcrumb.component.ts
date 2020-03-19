import {
    Component,
    OnInit,
    ViewChildren,
    ViewChild,
    TemplateRef,
    ContentChild,
    QueryList,
    ContentChildren,
    AfterViewInit,
    AfterViewChecked,
    AfterContentChecked,
    AfterContentInit,
    OnChanges
} from '@angular/core';
import { BreadcrumbItemComponent } from './item/breadcrumb-item.component';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent
    implements OnInit, AfterViewInit, AfterViewChecked, AfterContentChecked, AfterContentInit, OnChanges {
    items: BreadcrumbItemComponent[];
    @ViewChild('content', { static: true }) template: TemplateRef<any>;

    @ViewChild('book', { static: true }) book: TemplateRef<any>;

    @ContentChildren(BreadcrumbItemComponent) set _items(items: QueryList<BreadcrumbItemComponent>) {
        this.items = items.toArray();
    }

    constructor() {}

    ngAfterViewInit(): void {
        console.log('ngAfterViewInit');
    }

    ngAfterViewChecked(): void {
        console.log('ngAfterViewChecked');
    }

    ngAfterContentChecked(): void {
        console.log('ngAfterContentChecked');
    }

    ngAfterContentInit(): void {
        console.log('ngAfterContentInit');
    }

    ngOnInit(): void {
        console.log('ngOnInit');
        debugger;
        console.log(this.template.elementRef.nativeElement);
    }

    ngOnChanges() {
        console.log('ngOnChanges');
    }
}
