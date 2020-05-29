import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/home'

Vue.use(Router);

export default new Router({
    routes:[
        {
            path:'/',
            name: 'home',
            component: Home,
            redirect: { name: 'proxy' },
            children:[
                {
                    path:'/proxy',
                    name: 'proxy',
                    component: ()=>import('./views/proxy')
                },
                {
                    path:'/bookmarks',
                    name: 'bookmarks',
                    component: ()=>import('./views/bookmarks')
                },
            ]
        }
    ]
})
