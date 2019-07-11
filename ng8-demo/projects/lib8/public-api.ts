/*
 * Public API Surface of lib8
 */
import { ButtonModule } from '@worktile/lib8/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export * from '@worktile/lib8/entities';
export * from '@worktile/lib8/button';

@NgModule({
    imports: [CommonModule, ButtonModule],
    exports: [ButtonModule]
})
export class Lib8Module {}
