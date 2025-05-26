import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {flushSync, mount} from "svelte";
import GetListenerWithoutAutoDestroy from "./GetListenerWithoutAutoDestroy.svelte";
import {render, screen} from '@testing-library/svelte'
import userEvent from '@testing-library/user-event';

describe('GetListenerWithoutAutoDestroy', () => {


    it('should preserve counter value when toggling visibility', async () => {

        const user = userEvent.setup()
        let {container} = render(GetListenerWithoutAutoDestroy);

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
        expect(screen.getByTestId('count')!.textContent).toBe('4');

    });

});
