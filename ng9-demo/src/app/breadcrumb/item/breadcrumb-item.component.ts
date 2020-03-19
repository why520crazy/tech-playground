import {
    Component,
    OnInit,
    ElementRef,
    AfterViewInit,
    AfterViewChecked,
    AfterContentChecked,
    AfterContentInit,
    OnChanges
} from '@angular/core';

@Component({
    selector: 'app-breadcrumb-item',
    templateUrl: './breadcrumb-item.component.html'
})
export class BreadcrumbItemComponent
    implements OnInit, AfterViewInit, AfterViewChecked, AfterContentChecked, AfterContentInit, OnChanges {
    constructor(public elementRef: ElementRef) {}

    ngAfterViewInit(): void {
        console.log('item ngAfterViewInit');
    }

    ngAfterViewChecked(): void {
        console.log('item ngAfterViewChecked');
    }

    ngAfterContentChecked(): void {
        console.log('item ngAfterContentChecked');
    }

    ngAfterContentInit(): void {
        console.log('item ngAfterContentInit');
    }

    ngOnInit(): void {
        console.log('item ngOnInit');
        console.log(this.elementRef.nativeElement.innerHTML);
    }

    ngOnChanges() {
        console.log('item ngOnChanges');
    }
}
