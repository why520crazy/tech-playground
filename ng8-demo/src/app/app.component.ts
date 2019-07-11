import { Component, HostBinding } from '@angular/core';
import { DEFAULT_USER } from '@worktile/lib8/entities';
import { UserInfo } from '@worktile/lib8';
import { getBook } from '@worktile/lib8/utils';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    // @HostBinding(`class.${css.layout}`) hasClass = true;
    user: UserInfo = DEFAULT_USER;
    title = 'ng8-demo';
    book = getBook();
}
