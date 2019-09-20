import { of, OperatorFunction, Observable, fromEvent } from 'rxjs';
import { map, tap } from 'rxjs/operators';

function customLog<T>(name: string): OperatorFunction<T, T> {
    return input$ =>
        input$.pipe(
            tap(result => {
                console.log(`[${name}]: `, result);
            })
        );
}

of(1)
    .pipe(
        map(item => {
            return item * 2;
        }),
        customLog('map')
    )
    .subscribe();

of([1, 2, 3]).pipe(
    map(items => {
        return items.map(i => i * 2);
    }),
    customLog('map')
);
