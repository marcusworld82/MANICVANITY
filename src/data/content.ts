import { supabase } from '../lib/supabase';

export interface ContentPiece {
  id: string;
  title: string;
  slug: string;
  platform: 'YouTube' | 'LinkedIn' | 'Instagram' | 'Blog' | 'Email';
  status: 'Backlog' | 'Draft' | 'Review' | 'Scheduled' | 'Published';
  planned_at: string | null;
  published_at: string | null;
  thumbnail_url: string | null;
  brief: string | null;
  cta: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentIdea {
  id: string;
  title: string;
  notes: string | null;
  priority: 1 | 2 | 3;
  created_at: string;
  archived: boolean;
}

export interface ListPiecesParams {
  status?: string;
  platform?: string;
  from?: string;
  to?: string;
}

export interface ListCalendarParams {
  from: string;
  to: string;
}

export interface ListIdeasParams {
  includeArchived?: boolean;
}

// Fallback data for when Supabase is unavailable
const fallbackPieces: ContentPiece[] = [
  {
    id: 'fallback-1',
    title: 'Obsidian Dreams: AW24 Campaign',
    slug: 'obsidian-dreams-aw24',
    platform: 'YouTube',
    status: 'Published',
    planned_at: '2024-01-15T10:00:00Z',
    published_at: '2024-01-15T10:00:00Z',
    thumbnail_url: 'https://picsum.photos/1200/675?random=1',
    brief: 'Cinematic reveal of our darkest collection yet.',
    cta: 'Shop the Collection',
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'fallback-2',
    title: 'Midnight Rebellion Styling Guide',
    slug: 'midnight-rebellion-styling',
    platform: 'Instagram',
    status: 'Scheduled',
    planned_at: '2024-03-20T14:30:00Z',
    published_at: null,
    thumbnail_url: 'https://picsum.photos/800/600?random=2',
    brief: '5 ways to style our signature leather pieces.',
    cta: 'Get the Look',
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-12T10:00:00Z'
  },
  {
    id: 'fallback-3',
    title: 'The Art of Controlled Chaos',
    slug: 'art-controlled-chaos',
    platform: 'Blog',
    status: 'Review',
    planned_at: null,
    published_at: null,
    thumbnail_url: 'https://picsum.photos/1200/675?random=3',
    brief: 'Deep dive into our design philosophy.',
    cta: 'Read More',
    created_at: '2024-01-14T10:00:00Z',
    updated_at: '2024-01-14T10:00:00Z'
  },
  {
    id: 'fallback-4',
    title: 'Deconstructed Elegance Tutorial',
    slug: 'deconstructed-elegance-tutorial',
    platform: 'YouTube',
    status: 'Draft',
    planned_at: null,
    published_at: null,
    thumbnail_url: 'https://picsum.photos/1200/675?random=4',
    brief: 'Step-by-step guide to our signature look.',
    cta: 'Try the Look',
    created_at: '2024-01-16T10:00:00Z',
    updated_at: '2024-01-16T10:00:00Z'
  },
  {
    id: 'fallback-5',
    title: 'Underground Fashion Week Recap',
    slug: 'underground-fashion-week',
    platform: 'LinkedIn',
    status: 'Backlog',
    planned_at: null,
    published_at: null,
    thumbnail_url: 'https://picsum.photos/800/600?random=5',
    brief: 'Highlights from alternative fashion events.',
    cta: 'View Recap',
    created_at: '2024-01-18T10:00:00Z',
    updated_at: '2024-01-18T10:00:00Z'
  }
];

const fallbackIdeas: ContentIdea[] = [
  {
    id: 'idea-1',
    title: 'Shadows and Light Photography Series',
    notes: 'Dramatic black and white photography showcasing texture contrasts.',
    priority: 3,
    created_at: '2024-01-20T10:00:00Z',
    archived: false
  },
  {
    id: 'idea-2',
    title: 'Anti-Trend Trend Report',
    notes: 'Quarterly report on why following trends is the ultimate anti-trend.',
    priority: 2,
    created_at: '2024-01-21T10:00:00Z',
    archived: false
  },
  {
    id: 'idea-3',
    title: 'Deconstructed Garment Time-lapse',
    notes: 'Show creation process from concept to completion.',
    priority: 3,
    created_at: '2024-01-22T10:00:00Z',
    archived: false
  }
];

export const listPieces = async (params: ListPiecesParams = {}): Promise<ContentPiece[]> => {
  try {
    let query = supabase
      .from('content_pieces')
      .select('*')
      .order('created_at', { ascending: false });

    if (params.status) {
      query = query.eq('status', params.status);
    }

    if (params.platform) {
      query = query.eq('platform', params.platform);
    }

    if (params.from) {
      query = query.gte('planned_at', params.from);
    }

    if (params.to) {
      query = query.lte('planned_at', params.to);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching content pieces:', error);
      return fallbackPieces;
    }

    return data || fallbackPieces;
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    return fallbackPieces;
  }
};

export const updatePieceStatus = async (
  id: string, 
  status: ContentPiece['status'], 
  position?: number
): Promise<ContentPiece | null> => {
  try {
    const { data, error } = await supabase
      .from('content_pieces')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating content piece:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    return null;
  }
};

export const listCalendar = async (params: ListCalendarParams) => {
  try {
    const { data, error } = await supabase
      .from('content_pieces')
      .select('*')
      .not('planned_at', 'is', null)
      .gte('planned_at', params.from)
      .lte('planned_at', params.to)
      .order('planned_at');

    if (error) {
      console.error('Error fetching calendar data:', error);
      return {};
    }

    // Group by date
    const grouped = (data || []).reduce((acc, piece) => {
      if (!piece.planned_at) return acc;
      
      const date = piece.planned_at.split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(piece);
      return acc;
    }, {} as Record<string, ContentPiece[]>);

    return grouped;
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    return {};
  }
};

export const listIdeas = async (params: ListIdeasParams = {}): Promise<ContentIdea[]> => {
  try {
    let query = supabase
      .from('content_ideas')
      .select('*')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (!params.includeArchived) {
      query = query.eq('archived', false);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching content ideas:', error);
      return fallbackIdeas;
    }

    return data || fallbackIdeas;
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    return fallbackIdeas;
  }
};

export const createIdea = async (payload: {
  title: string;
  notes?: string;
  priority?: 1 | 2 | 3;
}): Promise<ContentIdea | null> => {
  try {
    const { data, error } = await supabase
      .from('content_ideas')
      .insert({
        title: payload.title,
        notes: payload.notes || null,
        priority: payload.priority || 2
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating content idea:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    return null;
  }
};

export const archiveIdea = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('content_ideas')
      .update({ archived: true })
      .eq('id', id);

    if (error) {
      console.error('Error archiving content idea:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    return false;
  }
};

export const createContentPiece = async (payload: {
  title: string;
  platform: ContentPiece['platform'];
  planned_at?: string;
  brief?: string;
}): Promise<ContentPiece | null> => {
  try {
    const slug = payload.title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const { data, error } = await supabase
      .from('content_pieces')
      .insert({
        title: payload.title,
        slug: `${slug}-${Date.now()}`, // Ensure uniqueness
        platform: payload.platform,
        status: 'Draft',
        planned_at: payload.planned_at || null,
        brief: payload.brief || null,
        thumbnail_url: `https://picsum.photos/1200/675?random=${Math.floor(Math.random() * 1000)}`
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating content piece:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    return null;
  }
};

export const updatePlannedDate = async (id: string, planned_at: string | null): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('content_pieces')
      .update({ planned_at, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error updating planned date:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    return false;
  }
};