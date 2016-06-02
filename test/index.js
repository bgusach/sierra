'use strict'

const tape = require('tape')
const mix = require('../src').mix
const _ = require('lodash')
const repr = JSON.stringify

const _tape = () => null // just a dummy func to deactivate tests

tape('Basing mixing works', t => {
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


_tape('Media queries are reorganized properly', t => {
    const res = estilo({
        div: {
            '@media screen': {
                width: 100
            }
        }
    })

    const expected = {
        '@media screen': {
            div: {
                width: 100
            }
        }
    }
    t.deepEqual(res, expected)
    t.end()
})

