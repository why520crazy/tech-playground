import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ParentComponent } from '../parent.component';

@Component({
    selector: 'app-child',
    templateUrl: './child.component.html',
    styleUrls: ['./child.component.scss']
})
export class ChildComponent implements OnInit {
    @Input() text: string;

    @Output() textClick = new EventEmitter();

    constructor(private parent: ParentComponent) {}

    ngOnInit() {}

    onTextClick(event: Event) {
        // this.textClick.emit(event);
        this.parent.onChildTextClick(event);
    }
}
