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
    OnChanges,
    Pipe,
    PipeTransform,
    SecurityContext
} from '@angular/core';
import { BreadcrumbItemComponent } from './item/breadcrumb-item.component';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safeHtml' })
export class SafeHtml implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}
    transform(html: string) {
        console.log(html);
        // return html;
        // const sanitizeHTML = this.sanitizer.sanitize(SecurityContext.HTML, html);
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }
}
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
        console.log(this.template.elementRef.nativeElement);
        console.log(this.template.elementRef)
    }

    ngOnChanges() {
        console.log('ngOnChanges');
    }
}
