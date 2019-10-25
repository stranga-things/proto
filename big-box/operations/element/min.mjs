import Algebra from '../algebra'
import ElementOperation from './operation'

export default class Minimum extends ElementOperation {
    constructor(A, B, R, axes) {
        super(A, B, R, axes, {
            before: Algebra.assign(
                this.symbolic.variables.T,
                Algebra.positiveInfinity(this.symbolic.variables.T.length)
            ),

            inside: Algebra.if(
                Algebra.lessThan(this.symbolic.variables.T, this.symbolic.variables.A).slice(0, 1),
                Algebra.assign(this.symbolic.variables.T, this.symbolic.variables.A)
            ),

            after: Algebra.assign(this.symbolic.variables.R, this.symbolic.variables.T),
        })
    }
}
