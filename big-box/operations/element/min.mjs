import Algebra from '../../algebra'
import { symbolicLoop, symbolicIndex } from '../utils'

export default {
    test: function (A, B, R, meta) {
        switch (true) {
            default: return this.symbolic(A, B, R, meta)
        }
    },

    symbolic: function (A, B, R, meta) {
        const innerLoopAxes = meta.axes
        const totalLoopAxes = [...new Array(A.shape.length).keys()]
        const outerLoopAxes = totalLoopAxes.filter(function (axis) { return !meta.axes.includes(axis) })

        const innerLoops = innerLoopAxes.map(symbolicLoop, A)
        const outerLoops = outerLoopAxes.map(symbolicLoop, A)

        const Aindex = symbolicIndex('A', totalLoopAxes)
        const RIndex = symbolicIndex('R', outerLoopAxes)

        const sT = Algebra.variable({ symbol: 'temp', index: '0', size: A.type.size })
        const sA = Algebra.variable({ symbol: 'A.data', index: 'Aindex', size: A.type.size })
        const sR = Algebra.variable({ symbol: 'R.data', index: 'RIndex', size: R.type.size })

        return new Function('A, B, R', [
            `const temp = new Array(${A.type.size})`,

            ...outerLoops,
            RIndex,

            `temp.fill(Number.POSITIVE_INFINITY)`,
            
            ...innerLoops,
            Aindex,

            `if${Algebra.min(sA, sT).reduce(function (logic, comparison) {
                return `${logic} && ${comparison}`
            })}`,

            ...Algebra.assign(sT, sA),

            '}'.repeat(innerLoopAxes.length),

            ...Algebra.assign(sR, sT),

            '}'.repeat(outerLoopAxes.length),

            'return R'
        ].join('\n'))
    }
}




