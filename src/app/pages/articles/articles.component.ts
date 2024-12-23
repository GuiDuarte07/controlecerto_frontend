import { ArticleService } from './../../services/article.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { marked } from 'marked';
import { InfoArticleResponse } from '../../models/InfoArticleResponse';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss',
})
export class ArticlesComponent {
  article: InfoArticleResponse | null = null;
  htmlContent: string = '';

  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
    private articleService: ArticleService
  ) {}

  ngOnInit() {
    this.loading = true;

    this.route.paramMap.subscribe((params) => {
      const title = params.get('title');

      if (title) {
        this.articleService.getArticleByTitle(title).subscribe({
          next: (article) => {
            this.article = article;

            this.loadMarkdown(this.article.mdFileName);
          },
          error: (err: HttpErrorResponse) => {
            this.error = err.error;
            this.loading = false;
          },
        });
      }
    });
  }

  loadMarkdown(fileName: string) {
    this.storageService.getMarkdown(fileName).subscribe({
      next: (markdown) => {
        const processMd = async () => {
          this.htmlContent = await marked(markdown);
        };

        processMd();
        this.loading = false;
        this.error = null;
      },
      error: (err) => {
        this.error = 'Não foi possível encontrar esse artigo.';
        this.loading = true;
      },
    });
  }
}
