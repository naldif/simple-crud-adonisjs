'use strict'

const { post } = require("@adonisjs/framework/src/Route/Manager");

const Post = use('App/Models/Post')
const { validate } = use('Validator')

class PostController {

    async index({ request, response, view}){
        const posts = await Post.all();

        return view.render('posts.index', { posts: posts.rows })
    }

    create({request, response, view}) {
        return view.render('posts.create')
    }

    async store({ request, response, view, session }){
        const post = new Post() 

        const rules = {
            title: 'required',
            content: 'required'
        }

        const messages = {
            'title.required': 'Title tidak boleh kosong',
            'content.required': 'Content tidak boleh kosong'
        }

        const validation = await validate(request.all(), rules, messages)

        if (validation.fails()) {
            session.withErrors(validation.messages())
      
            return response.redirect('back')
        }

        post.title = request.input('title')
        post.content = request.input('content')
        await post.save()

        session.flash({ notification: 'Data Berhasil Disimpan!' })
        return response.route('posts.index')
    }

    async edit({ request, response, view, params }){
        const id = params.id
        const post = await Post.find(id)

        return view.render('posts.edit', {post: post})
    }

    async update({ request, response, view, params, session }) {
        const id = params.id
        const post = await Post.find(id)

        post.title = request.input('title')
        post.content = request.input('content')
        await post.save()

        session.flash({ notification: 'Data Berhasil Diupdate!' })
        return response.route('posts.index')
    }

    async delete({ request, response, view, params, session }) {
        const id = params.id
        const post = await Post.find(id)
        await post.delete()

        session.flash({ notification: 'Data Berhasil Dihapus!' })
        return response.route('posts.index')
    }
}

module.exports = PostController
