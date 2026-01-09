import fs from 'fs';
import path from 'path';
import { JSDOM, VirtualConsole } from 'jsdom';
import { Readability } from '@mozilla/readability';
import 'server-only';
import { Topic, PostListItem, PostContent } from './types';

const postsDirectory = path.join(process.cwd(), 'public/content/blog posts');

function toTitleCase(s: string): string {
  return s
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .split(' ')
    .map(w => w ? w[0].toUpperCase() + w.slice(1) : '')
    .join(' ');
}

function formatTitle(raw: string): string {
  const t = toTitleCase(raw);
  return t.length > 120 ? t.slice(0, 117).trimEnd() + '…' : t;
}

export function getAllTopics(): Topic[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(postsDirectory);
  const topics = fileNames
    .filter(fileName => {
      const fullPath = path.join(postsDirectory, fileName);
      return fs.statSync(fullPath).isDirectory();
    })
    .map(topic => {
      // Count valid posts
      const topicDir = path.join(postsDirectory, topic);
      const files = fs.readdirSync(topicDir);
      const count = files.filter(f => f.endsWith('.html') && !f.startsWith('index')).length;
      
      return {
        id: topic,
        name: topic.replace(/-/g, ' ').replace(/_/g, ' '),
        count
      };
    })
    .filter(topic => topic.count > 0); // Only return topics with posts
    
  return topics;
}

export function getPostsByTopic(topic: string): PostListItem[] {
  const topicDir = path.join(postsDirectory, topic);
  if (!fs.existsSync(topicDir)) {
    return [];
  }
  const fileNames = fs.readdirSync(topicDir);
  
  const posts = fileNames
    .filter(fileName => fileName.endsWith('.html') && !fileName.startsWith('index'))
    .map(fileName => {
      const title = formatTitle(fileName.replace('.html', '').replace(/_/g, ' ').replace(/-/g, ' '));

      return {
        slug: fileName.replace('.html', ''),
        title: title.trim(),
        topic
      };
    });
    
  return posts;
}

export function getAllPosts(): PostListItem[] {
  const topics = getAllTopics();
  let allPosts: PostListItem[] = [];
  
  for (const topic of topics) {
    const posts = getPostsByTopic(topic.id);
    allPosts = [...allPosts, ...posts];
  }
  
  return allPosts.map(p => ({ ...p, title: formatTitle(p.title) }));
}

export function getPostContent(topic: string, slug: string): PostContent | null {
  const fullPath = path.join(postsDirectory, topic, `${slug}.html`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  
  // Suppress JSDOM CSS parsing errors
  const virtualConsole = new VirtualConsole();
  virtualConsole.on("error", () => { /* Skip errors */ });
  virtualConsole.on("jsdomError", () => { /* Skip jsdom errors */ });
  
  const dom = new JSDOM(fileContents, { virtualConsole });
  
  // Rewrite image sources to be absolute paths served from public/content
  const imgs = dom.window.document.querySelectorAll('img');
  imgs.forEach(img => {
      const src = img.getAttribute('src');
      if (src && !src.startsWith('http') && !src.startsWith('//') && !src.startsWith('/')) {
          // It's a relative path.
          // The images are served from /content/blog posts/topic/image.jpg
          // We need to encode the path segments
          img.setAttribute('src', `/content/blog%20posts/${encodeURIComponent(topic)}/${src}`);
      }
  });

  // Use Readability to extract main content
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  const titleFromSlug = formatTitle(slug);

  if (!article) {
    // Fallback if Readability fails
    return {
      topic,
      slug,
      title: titleFromSlug,
      content: dom.window.document.body.innerHTML,
      textContent: dom.window.document.body.textContent || ''
    };
  }

  let title = article.title || '';
  const docTitle = dom.window.document.title;

  // Heuristic: If the extracted title matches the document title, and the document title
  // seems generic (e.g., "Free Acne Articles"), prefer the slug.
  // Also, if the title is empty.
  if (!title || title === docTitle) {
      // If the title looks like a site title (contains "Articles", "Blog", etc.)
      if (title && (title.includes('Articles') || title.includes('Blog') || title.includes('Free'))) {
          title = titleFromSlug;
      }
      // If the slug title is more descriptive (longer) or the title is very short
      else if (titleFromSlug.length > (title.length || 0)) {
           // This is risky, but for this specific dataset where filenames are descriptive...
           title = titleFromSlug;
      }
  }
  
  // If title is still just the topic name or generic, use slug
  if (title.toLowerCase() === topic.replace(/-/g, ' ').toLowerCase()) {
      title = titleFromSlug;
  }

  return {
    topic,
    slug,
    title: formatTitle(title || titleFromSlug),
    content: article.content || '',
    textContent: article.textContent || ''
  };
}

export function getPostPreview(topic: string, slug: string): { title: string; excerpt: string } | null {
  const content = getPostContent(topic, slug);
  if (!content) return null;
  const words = (content.textContent || '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
  const excerpt = words.slice(0, 26).join(' ');
  return { title: content.title, excerpt };
}
