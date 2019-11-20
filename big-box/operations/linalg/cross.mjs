import Algebra from '../../template/algebra'
import LinearAlgebraOperation from './operation.mjs'

export default class CrossProduct extends LinearAlgebraOperation {
    constructor(args) {
        /** Superclass */
        super(args)

        /** Result */
        this.result = args.result || this.resultant()

        /** Initialize */
        this.pointwiseSourceBoilerplate() // super class method
        this.pointwiseSourceTemplate()

        /** Create */
        this.invoke = new Function('A,B,R', [this.source, 'return R'].join('\n'))

        /** Template */
        if (!args.template)
            this.invoke = this.invoke.bind(null, this.of, this.with, this.result)
    }

    /** Resultant Tensor */
    resultant() { return Tensor.zeros({ shape: [3, 1], type: this.of.type }) }

    /** Pointwise Implementation */
    pointwiseSourceTemplate() {
        const A = [], B = [], R = []

        for (let i = 0; i < 3; i++) {
            A.push(Algebra.variable({ symbol: 'A.data', index: this.of.header.flatIndex([i, 0]), size: this.of.type.size }))
            B.push(Algebra.variable({ symbol: 'B.data', index: this.with.header.flatIndex([i, 0]), size: this.with.type.size }))
            R.push(Algebra.variable({ symbol: 'R.data', index: this.result.header.flatIndex([i, 0]), size: this.result.type.size }))
        }

        this.source = [
            Algebra.assign(R[0], Algebra.add(Algebra.negate(Algebra.multiply(A[2], B[1])), Algebra.multiply(B[2], A[1]))),
            Algebra.assign(R[1], Algebra.add(Algebra.negate(Algebra.multiply(A[0], B[2])), Algebra.multiply(B[0], A[2]))),
            Algebra.assign(R[2], Algebra.subtract(Algebra.multiply(A[0], B[1]), Algebra.multiply(B[0], A[1]))),
        ].join('\n')
    }
}
