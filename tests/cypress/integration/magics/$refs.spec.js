import { haveText, html, test } from '../../utils'

test('can reference elements from event listeners',
    html`
        <div x-data="{}">
            <button x-on:click="$refs['bob'].textContent = 'lob'"></button>

            <span x-ref="bob"></span>
        </div>
    `,
    ({ get }) => {
        get('button').click()
        get('span').should(haveText('lob'))
    }
)

test('can reference elements from data object methods',
    html`
        <div x-data="{ foo() { this.$refs.bob.textContent = 'lob' } }">
            <button x-on:click="foo()"></button>

            <span x-ref="bob"></span>
        </div>
    `,
    ({ get }) => {
        get('button').click()
        get('span').should(haveText('lob'))
    }
)

test('can reference elements from x-init',
    html`
        <div x-data x-init="$refs.foo.textContent = 'lob'">
            <span x-ref="foo">bob</span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('lob'))
    }
)

test('can reference elements outside of x-init',
    html`
        <div x-data x-ref="foo" data-foo="bar">
            <div x-init="() => {}">
                <span x-text="$refs.foo.dataset.foo"></span>
            </div>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
    }
)
