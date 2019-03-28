import * as types from '@/store/mutations-type'

const matutation = {
    [types.SET_PLANDETAIL](state, plandetail) {
        state.plandetail = plandetail
    }
}

export default matutation