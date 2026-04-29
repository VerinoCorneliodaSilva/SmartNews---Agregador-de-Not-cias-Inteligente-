import { Article } from '../types';
import { analyzeSentiment } from './ai';



const categoryMapping: { [key: string]: string } = {
  business: 'Negócios',
  entertainment: 'Entretenimento',
  general: 'Geral',
  health: 'Saúde',
  science: 'Ciência',
  sports: 'Desporto',
  technology: 'Tecnologia'
};

// Fallback high quality articles if network goes down
const fallbackNews: Partial<Article>[] = [
  {
    title: 'Avanço na Inteligência Artificial revoluciona a medicina diagnóstica',
    description: 'Algoritmos modernos conseguem detectar doenças raras em poucos segundos com precisão recorde. Pesquisadores de todo o mundo comemoram o avanço.',
    url: 'https://example.com/ai-medicina',
    urlToImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
    publishedAt: new Date().toISOString(),
    source: { id: 'tech-news', name: 'Inovação Médica' },
    category: 'technology'
  },
  {
    title: 'Inflação cai e mercados internacionais registram forte alta',
    description: 'Bolsas de valores da Europa e América operam no verde após relatório econômico positivo. Investidores ganham confiança no futuro.',
    url: 'https://example.com/economia',
    urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80',
    publishedAt: new Date().toISOString(),
    source: { id: 'finance', name: 'Global Finance' },
    category: 'business'
  },
  {
    title: 'Estudo revela benefícios de dormir 8 horas por noite para o cérebro',
    description: 'Dormir o tempo adequado melhora a fixação da memória e previne o envelhecimento precoce das células cognitivas.',
    url: 'https://example.com/saude',
    urlToImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80',
    publishedAt: new Date().toISOString(),
    source: { id: 'health-mag', name: 'Vida & Saúde' },
    category: 'health'
  }
];

export async function fetchNewsByCategory(category: string): Promise<Article[]> {
  try {
    const apiCategory = Object.keys(categoryMapping).find(
      key => categoryMapping[key].toLowerCase() === category.toLowerCase()
    ) || 'technology';

    const response = await fetch(`https://saurav.tech/NewsAPI/top-headlines/category/${apiCategory}/us.json`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar as notícias');
    }

    const data = await response.json();
    
    if (!data.articles || data.articles.length === 0) {
      throw new Error('Nenhum artigo encontrado');
    }

    return data.articles.map((art: any, index: number) => ({
      id: `${apiCategory}-${index}-${art.publishedAt}`,
      title: art.title || 'Sem Título',
      description: art.description || 'Nenhum detalhe adicional fornecido para este artigo no momento.',
      url: art.url || '#',
      urlToImage: art.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80',
      publishedAt: art.publishedAt || new Date().toISOString(),
      source: art.source || { id: null, name: 'Fonte Confiável' },
      category: categoryMapping[apiCategory],
      sentiment: analyzeSentiment(art.title || '', art.description || '')
    }));
  } catch (error) {
    console.error(`Erro ao carregar notícias de ${category}:`, error);
    
    // Map fallbacks matching standard categories
    return fallbackNews.map((f, i) => ({
      id: `fallback-${f.category}-${i}`,
      title: f.title!,
      description: f.description!,
      url: f.url!,
      urlToImage: f.urlToImage!,
      publishedAt: f.publishedAt!,
      source: f.source!,
      category: categoryMapping[f.category!] || 'Tecnologia',
      sentiment: analyzeSentiment(f.title!, f.description!)
    }));
  }
}

export async function fetchAllNews(): Promise<Article[]> {
  const categoriesToFetch = ['technology', 'business', 'health', 'science', 'sports', 'entertainment'];
  
  const results = await Promise.allSettled(
    categoriesToFetch.map(cat => fetchNewsByCategory(categoryMapping[cat]))
  );

  const aggregated: Article[] = [];

  results.forEach(res => {
    if (res.status === 'fulfilled') {
      aggregated.push(...res.value);
    }
  });

  // Sort by published date
  return aggregated.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
