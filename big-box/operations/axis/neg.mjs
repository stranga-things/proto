import Algebra from '../../template/algebra'
import AxisOperation from './operation'

export default class Negation extends AxisOperation {
    constructor(args) {
        /** Defaults */
        args.axes = args.axes || []

        /** Superclass */
        super(args)

        /** Result */
        this.result = args.result || this.resultant()

        /** Initialize */
        if (this.of.size > 0) {
            this.symbolicBoilerplate() // super class method 
            this.symbolicSourceTemplate() // super class method, utilizes helpers below
        }

        /** Create */
        this.invoke = new Function('A,B,R', [this.source, 'return R'].join('\n'))

        /** Template */
        if (!args.template)
            this.invoke = this.invoke.bind(null, this.of, this.with, this.result)
    }

    /** Symbolic Implementation */
    start() { }

    preLoop() { }

    inLoop() {
        return Algebra.assign(this.variables.result, Algebra.negate(this.variables.of))
    }

    postLoop() { }

    finish() { }

    /** (TODO) Pointwise Implementation */
}
