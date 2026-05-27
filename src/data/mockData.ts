export interface Paper {
  id: string;
  title: string;
  abstract: string;
  venue: string;
  year: number;
  ranking?: string;
  keywords: string[];
}

export interface Citation {
  source: string; // Paper ID that is citing
  target: string; // Paper ID being cited
}

export const mockPapers: Paper[] = [
  {
    id: 'p1',
    title: 'Attention Is All You Need',
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
    venue: 'NIPS',
    year: 2017,
    ranking: 'Core A*',
    keywords: ['Transformers', 'NLP', 'Attention'],
  },
  {
    id: 'p2',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
    abstract: 'We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers.',
    venue: 'NAACL',
    year: 2019,
    ranking: 'Core A*',
    keywords: ['Transformers', 'NLP', 'Pre-training'],
  },
  {
    id: 'p3',
    title: 'Generative Adversarial Nets',
    abstract: 'We propose a new framework for estimating generative models via an adversarial process, in which we simultaneously train two models: a generative model G that captures the data distribution, and a discriminative model D that estimates the probability that a sample came from the training data rather than G.',
    venue: 'NIPS',
    year: 2014,
    ranking: 'Core A*',
    keywords: ['GAN', 'Generative Models'],
  },
  {
    id: 'p4',
    title: 'A Style-Based Generator Architecture for Generative Adversarial Networks',
    abstract: 'We propose an alternative generator architecture for generative adversarial networks, borrowing from style transfer literature. The new architecture leads to an automatically learned, unsupervised separation of high-level attributes (e.g., pose and identity when trained on human faces) and stochastic variation in the generated images (e.g., freckles, hair), and it enables intuitive, scale-specific control of the synthesis.',
    venue: 'CVPR',
    year: 2019,
    ranking: 'Core A*',
    keywords: ['GAN', 'StyleGAN', 'Computer Vision'],
  }
];

// In this mock graph, we have two disconnected clusters: (p1, p2) and (p3, p4)
export const mockCitations: Citation[] = [
  { source: 'p2', target: 'p1' }, // BERT cites Attention is All You Need
  { source: 'p4', target: 'p3' }, // StyleGAN cites GAN
];
