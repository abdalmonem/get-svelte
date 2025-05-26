import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {flushSync, mount} from "svelte";
import GetListenerWithAutoDestroy from "./GetListenerWithAutoDestroy.svelte";
import {render, screen} from '@testing-library/svelte'
import userEvent from '@testing-library/user-event';

describe('GetListenerWitAutoDestroy', () => {


    it('should return counter to zero value when toggling to invisible', async () => {

        const user = userEvent.setup()
        let {container} = render(GetListenerWithAutoDestroy);

        // get intial count from span id="count"

        const button = container.querySelector('#incrementButton',)


        expect(screen.getByTestId('count')!.textContent).toBe('0');

        await user.click(screen.getByTestId('incrementButton')!);
        await user.click(screen.getByTestId('incrementButton')!);
        await user.click(screen.getByTestId('incrementButton')!);

        expect(screen.getByTestId('count')!.textContent).toBe('3');


        // Hide the GetListener
        await user.click(screen.getByTestId('toggleButton')!);
        // Show it again
        await user.click(screen.getByTestId('toggleButton')!);

        await user.click(screen.getByTestId('incrementButton')!);
        expect(screen.getByTestId('count')!.textContent).toBe('1');

    });

});
