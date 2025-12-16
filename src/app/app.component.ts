import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from './services/post.service';
import { Post } from './models/post.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  posts: Post[] = [];
  showForm = false;
  loading = false;
  errorMessage = '';
  
  newPost: Post = {
    title: '',
    body: '',
    userId: 1
  };

  constructor(private postService: PostService) {}

  async ngOnInit() {
    await this.loadPosts();
  }

  async loadPosts() {
    this.loading = true;
    this.errorMessage = '';
    
    try {
      this.posts = await this.postService.getPosts();
    } catch (error) {
      this.errorMessage = 'Failed to load posts. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  async onSubmit() {
    if (!this.newPost.title.trim() || !this.newPost.body.trim()) {
      this.errorMessage = 'Title and body are required';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const createdPost = await this.postService.createPost(this.newPost);
      this.posts.push(createdPost);
      this.toggleForm();
    } catch (error) {
      this.errorMessage = 'Failed to add post. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  resetForm() {
    this.newPost = {
      title: '',
      body: '',
      userId: 1
    };
  }
}