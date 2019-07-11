/*
 * Public API Surface of lib8
 */
import { ButtonModule } from 'lib8/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export * from 'lib8/entities';
export * from 'lib8/button';

@NgModule({
    imports: [CommonModule, ButtonModule],
    exports: [ButtonModule]
})
export class Lib8Module {}
