import { Article, UserProfile } from '../types';

// Simple rules-based sentiment analyzer
export function analyzeSentiment(title: string, description: string): 'Positivo' | 'Neutro' | 'Negativo' {
  const text = `${title} ${description}`.toLowerCase();
  
  const positiveWords = [
    'excelente', 'sucesso', 'vitória', 'ganha', 'conquista', 'avanço', 'melhor', 
    'cresce', 'lucro', 'descobre', 'novo', 'inovação', 'lançamento', 'bem', 
    'good', 'best', 'win', 'breakthrough', 'growth', 'profit', 'success', 'launch'
  ];
  
  const negativeWords = [
    'crise', 'morte', 'morre', 'queda', 'perda', 'perigoso', 'demissão', 'cancelado',
    'guerra', 'violência', 'ataque', 'crime', 'assalto', 'roubo', 'acidente',
    'crash', 'war', 'death', 'crisis', 'down', 'fire', 'loss', 'danger', 'fail'
  ];

  let score = 0;
  
  positiveWords.forEach(word => {
    if (text.includes(word)) score += 1;
  });

  negativeWords.forEach(word => {
    if (text.includes(word)) score -= 1;
  });

  if (score > 0) return 'Positivo';
  if (score < 0) return 'Negativo';
  return 'Neutro';
}

// Simulated dynamic AI summary engine
export function generateAISummary(article: Article): string {
  if (article.summary) return article.summary;

  const sentences = article.description 
    ? article.description.split('.').map(s => s.trim()).filter(s => s.length > 10)
    : [];

  const baseSummary = sentences.length > 0 
    ? sentences[0] 
    : article.title;

  // Enhance synthesis using smart templates
  const templates = [
    `Em resumo: Esta matéria explora como "${article.title}". ${baseSummary ? `O acontecimento destaca que ${baseSummary}.` : ''} É um marco importante no setor de ${article.category.toUpperCase()}.`,
    `Destaque IA: A notícia aborda o tema "${article.title}". ${baseSummary ? `Um ponto chave reportado indica: "${baseSummary}".` : ''} Representa uma mudança sensível na editoria de ${article.category}.`,
    `Análise Automatizada: "${article.title}". ${baseSummary ? `Informações preliminares detalham que ${baseSummary}.` : ''} Especialistas acompanham os desdobramentos de perto.`
  ];

  // Pick template based on title length
  const templateIdx = article.title.length % templates.length;
  return templates[templateIdx];
}

// Content-based recommendation algorithm
export function recommendArticles(articles: Article[], user: UserProfile | null): Article[] {
  if (!user) return articles;

  const preferredCategories = user.preferences.categories || [];
  
  // Calculate category weights based on reading history
  const historyCounts: { [key: string]: number } = {};
  user.history.forEach(category => {
    historyCounts[category] = (historyCounts[category] || 0) + 1;
  });

  return [...articles].sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    // Weight 1: Expressed Preferences
    if (preferredCategories.includes(a.category)) scoreA += 5;
    if (preferredCategories.includes(b.category)) scoreB += 5;

    // Weight 2: Reading History (Implicit preference)
    scoreA += (historyCounts[a.category] || 0) * 2;
    scoreB += (historyCounts[b.category] || 0) * 2;

    // Weight 3: Newest articles
    const dateA = new Date(a.publishedAt).getTime();
    const dateB = new Date(b.publishedAt).getTime();
    
    // Add tiny decimal weight for recency
    scoreA += dateA / 1000000000000;
    scoreB += dateB / 1000000000000;

    return scoreB - scoreA;
  });
}
