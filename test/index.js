'use strict'

const tape = require('tape')
const mix = require('../src').mix
const normalize = require('../src').normalize
const _ = require('lodash')
const repr = JSON.stringify

const _tape = () => null // just a dummy func to deactivate tests


tape('Basic mixing works', t => {
    const res = mix({a: 1, b: 1, c: 1}, {b: 2}, {c: 3})
    t.deepEqual(res, {a: 1, b: 2, c: 3})
    t.end()
})


tape('Falsy values are ignored while mixing', t => {
    const res = mix({a: 2}, false, {b: 3}, null, undefined)
    const expected = {a: 2, b: 3}

    t.deepEqual(res, expected)
    t.end()
})


tape('Normalizing simple style', t => {
    const input = {
        selector: {
            minWidth: '34px',
            borderWidth: '10px',
            backgroundColor: '#cccccc'
        }
    }

    const expected = {
        selector: {
            'min-width': '34px',
            'border-width': '10px',
            'background-color': '#cccccc',
        }
    }

    t.deepEqual(normalize(input), expected)

    t.end()
})


tape('Normalizing nested style', t => {
    const input = {
        selector: {
            subSelector: {
                minWidth: '34px',
                borderWidth: '10px',
                backgroundColor: '#cccccc'
            }
        }
    }

    const expected = {
        'selector subSelector': {
            'min-width': '34px',
            'border-width': '10px',
            'background-color': '#cccccc',
        }
    }

    t.deepEqual(normalize(input), expected)

    t.end()
})


_tape('Values must be numbers, strings or objects', t => {
    for (let value of [null, undefined, [], true, false]) {
        let thrown = false

        try {
            estilo({ div: { width: value } })
        } catch (exc) {
            thrown = true
        }

        t.ok(thrown, 'Error was raised for invalid value: ' + repr(value))
    }

    for (let value of [123, 'lol', {}]) {
        estilo({ div: { width: value } })
    }

    t.end()
})


tape('Non-nested media queries are reorganized properly', t => {
    const res = normalize({
        div: {
            height: '50px',
            '@media screen': {
                width: '100px', 
                '.class': {
                    zIndex: 45,
                }
            }
        }
    })

    const expected = {
        '@media screen': {
            div: {
                width: '100px'
            },

            'div .class': {
                'z-index': 45,
            }
        },

        div: {
            height: '50px',
        },
    }
    t.deepEqual(res, expected)
    t.end()
})

tape('Non-nestable at-rules are identified properly', t => {
    const res = normalize({
        '@charset': 'utf-8',
        div: {
            width: '10px',
        }
    })

    const expected = {
        '@charset': 'utf-8',
        div: {
            width: '10px',
        }
    }

    t.deepEqual(res, expected)

    t.end()
})


