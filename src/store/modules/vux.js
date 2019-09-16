export default {
	state: {
		demoScrollTop: 0, // 页面滑动位置
		isLoading: false, // 是否在加载中
		userMessage: localStorage.getItem('userMessage') ? JSON.parse(localStorage.getItem('userMessage')) : {}, // 用户信息
		direction: '' // 页面切换方向
	},
	mutations: {
		updatePosition (state, payload) {
			state.demoScrollTop = payload.top
		},
		updateLoadingStatus (state, payload) {
			state.isLoading = payload.isLoading
		},
		updateDirection (state, payload) {
			state.direction = payload.direction
		},
		updateUserMessage (state, payload) {
			const userMessage = payload.userMessage

			localStorage.setItem('userMessage', JSON.stringify(userMessage))
			state.userMessage = userMessage
		}
	},
	actions: {
		updatePosition ({commit}, top) {
			commit({type: 'updatePosition', top: top})
		}
	},
	getters:{
		getlogin: state =>{
			return state.userMessage
		}
	}
}